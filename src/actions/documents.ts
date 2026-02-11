"use server";

import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDocuments() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const docs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id),
    });

    return docs;
}

export async function getDocumentReviewStatus(step?: number) {
    const session = await auth();
    if (!session?.user?.id) return { hasDocumentsInReview: false, hasUploadedDocs: false, allApproved: false, stepApprovalStatus: "pending" };

    const docs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id),
    });

    // Use STEP_REQUIREMENTS as single source of truth for required document types
    const { STEP_REQUIREMENTS } = await import("@/lib/constants");
    const requiredTypes: string[] = step ? (STEP_REQUIREMENTS[step] || []) : [];

    // If step is provided and has requirements, filter by those types.
    // If step is provided but has NO requirements (e.g. Step 6), relevantDocs should be empty.
    let relevantDocs = docs;
    if (requiredTypes.length > 0) {
        relevantDocs = docs.filter(doc => requiredTypes.includes(doc.type));
    } else if (step) {
        relevantDocs = [];
    }

    const hasDocumentsInReview = relevantDocs.some(doc => doc.status === "reviewing");
    const hasUploadedDocs = relevantDocs.some(doc => doc.status === "uploaded");

    // Check if ALL required documents for the step are present and approved
    let allApproved = false;
    if (requiredTypes.length > 0) {
        allApproved = requiredTypes.every((type: string) =>
            relevantDocs.some(doc => doc.type === type && doc.status === "approved")
        );
    } else if (relevantDocs.length > 0) {
        allApproved = relevantDocs.every(doc => doc.status === "approved");
    }

    // Special check for Step 4 (Contract): admin_contract must also exist
    if (step === 4 && allApproved) {
        const adminContract = docs.find(doc => doc.type === "admin_contract");
        if (!adminContract) {
            allApproved = false;
        }
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { stepApprovalStatus: true }
    });

    // Determine finalStepStatus:
    // - If allApproved (all docs present & approved), status is "approved"
    // - If required docs exist but none uploaded, force "pending" (don't trust stale dbStatus)
    // - If admin explicitly set stepApprovalStatus to "approved" (via manage-document auto-check), trust it
    // - Otherwise use DB status (typically "pending")
    const dbStatus = user?.stepApprovalStatus || "pending";
    let finalStepStatus: string;
    if (allApproved) {
        finalStepStatus = "approved";
    } else if (requiredTypes.length > 0 && relevantDocs.length === 0) {
        // Required documents exist for this step but none uploaded — always pending
        finalStepStatus = "pending";
    } else {
        finalStepStatus = dbStatus;
    }

    return {
        hasDocumentsInReview,
        hasUploadedDocs,
        allApproved,
        stepApprovalStatus: finalStepStatus
    };
}

export async function updateDocumentStatus(docId: string, status: "pending" | "uploaded" | "reviewing" | "approved" | "rejected") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(documents)
        .set({ status, updatedAt: new Date() })
        .where(and(eq(documents.id, docId), eq(documents.userId, session.user.id)));

    revalidatePath("/documents");
    revalidatePath("/contract");
}

export async function uploadContract(fileName: string, fileUrl: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if contract document exists
    const existing = await db.query.documents.findFirst({
        where: and(
            eq(documents.userId, session.user.id),
            eq(documents.type, "signed_contract")
        )
    });

    if (existing) {
        await db.update(documents)
            .set({
                status: "uploaded",
                fileName,
                fileUrl,
                rejectionReason: null, // Clear rejection reason
                updatedAt: new Date()
            })
            .where(eq(documents.id, existing.id));
    } else {
        await db.insert(documents).values({
            userId: session.user.id,
            type: "signed_contract",
            label: "İmzalı Sözleşme",
            status: "uploaded",
            fileName,
            fileUrl,
            rejectionReason: null
        });
    }

    revalidatePath("/contract");
}

export async function uploadDocument(type: string, fileName: string, fileUrl: string, label: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existing = await db.query.documents.findFirst({
        where: and(
            eq(documents.userId, session.user.id),
            eq(documents.type, type)
        )
    });

    let docId: string;

    if (existing) {
        await db.update(documents)
            .set({
                status: "uploaded",
                fileName,
                fileUrl,
                rejectionReason: null, // Clear rejection reason on new upload
                updatedAt: new Date()
            })
            .where(eq(documents.id, existing.id));
        docId = existing.id;
    } else {
        const [newDoc] = await db.insert(documents).values({
            userId: session.user.id,
            type,
            label,
            status: "uploaded",
            fileName,
            fileUrl,
            rejectionReason: null // Ensure it's null on insert (though default is null)
        }).returning({ id: documents.id });
        docId = newDoc.id;
    }

    revalidatePath("/documents");
    return { id: docId };
}

export async function deleteDocument(docId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Only allow deleting documents with "uploaded" status
    const doc = await db.query.documents.findFirst({
        where: and(
            eq(documents.id, docId),
            eq(documents.userId, session.user.id)
        )
    });

    if (!doc) throw new Error("Document not found");
    if (doc.status !== "uploaded") throw new Error("Only uploaded documents can be deleted");

    // Reset the document to pending status instead of deleting
    await db.update(documents)
        .set({
            status: "pending",
            fileName: null,
            fileUrl: null,
            updatedAt: new Date()
        })
        .where(eq(documents.id, docId));

    revalidatePath("/documents");
}

export async function submitDocumentsForReview(step?: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Use STEP_REQUIREMENTS as single source of truth
    const { STEP_REQUIREMENTS } = await import("@/lib/constants");
    const requiredTypes: string[] = step ? (STEP_REQUIREMENTS[step] || []) : [];

    // Get all user documents
    const userDocs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id)
    });

    // Filter by step if provided
    let relevantDocs = userDocs;
    if (requiredTypes.length > 0) {
        relevantDocs = userDocs.filter(doc => requiredTypes.includes(doc.type));
    }

    // Check if all relevant documents are already approved or reviewing (no need to submit again)
    const allReviewingOrApproved = relevantDocs.length > 0 && relevantDocs.every(
        doc => doc.status === "reviewing" || doc.status === "approved"
    );

    if (allReviewingOrApproved) {
        return { success: false, message: "Belgeleriniz zaten inceleme aşamasında veya onaylandı." };
    }

    // Check if any documents are uploaded (including re-uploaded after rejection)
    const uploadedDocs = relevantDocs.filter(doc => doc.status === "uploaded");
    if (uploadedDocs.length === 0) {
        return { success: false, message: "Lütfen en az bir belge yükleyiniz." };
    }

    // Update uploaded documents to reviewing status
    for (const doc of uploadedDocs) {
        await db.update(documents)
            .set({
                status: "reviewing",
                updatedAt: new Date()
            })
            .where(eq(documents.id, doc.id));
    }

    // Update user's stepApprovalStatus to indicate documents are in review
    await db.update(users)
        .set({
            stepApprovalStatus: "pending",
            updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

    revalidatePath("/documents");
    revalidatePath("/contract");
    revalidatePath("/translation");
    revalidatePath("/dashboard");

    // Send WhatsApp Notification for Step 3 (Evrak), Step 4 (Contract) and Step 5 (Tercüme)
    if (step === 3 || step === 4 || step === 5) {
        try {
            const { createNotification } = await import("./notifications");

            let title = "";
            let message = "";

            if (step === 3) {
                title = "Evraklarınız Alındı";
                message = "Tüm evraklarınız tarafımıza ulaştı, en kısa zamanda inceleyip size döneceğiz.";
            } else if (step === 4) {
                title = "Sözleşmeniz Alındı";
                message = "İmzalı sözleşmeniz tarafımıza ulaştı. En kısa sürede incelenip onaylanacaktır.";
            } else {
                title = "Tercüme Belgeleriniz Alındı";
                message = "Tüm tercüme belgeleriniz tarafımıza ulaştı, en kısa zamanda inceleyip size döneceğiz.";
            }

            await createNotification(
                session.user.id,
                "document_uploaded",
                title,
                message
            );
        } catch (error) {
            console.error("Failed to send WhatsApp notification:", error);
        }
    }

    return { success: true, message: "Belgeleriniz onaya gönderildi.", isInReview: true };
}
