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
    if (!session?.user?.id) return { hasDocumentsInReview: false, allApproved: false };

    const docs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id),
    });

    // Define which document types belong to which step
    const stepDocTypes: Record<number, string[]> = {
        3: ["passport", "diploma", "transcript", "biometric_photo"], // Documents (Step 3)
        4: ["signed_contract"], // Contract (Step 4)
        5: ["passport_translation", "diploma_translation", "transcript_translation"], // Translation (Step 5)
    };

    // If step is provided, filter by that step's document types
    let relevantDocs = docs;
    if (step && stepDocTypes[step]) {
        relevantDocs = docs.filter(doc => stepDocTypes[step].includes(doc.type));
    }

    // Treat 'uploaded' as in-review for UI feedback if not all are approved yet
    const hasDocumentsInReview = relevantDocs.some(doc => doc.status === "reviewing");
    const hasUploadedDocs = relevantDocs.some(doc => doc.status === "uploaded");
    const allApproved = relevantDocs.length > 0 && relevantDocs.every(doc => doc.status === "approved");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { stepApprovalStatus: true }
    });

    // Fallback: If all docs are approved but step status isn't updated yet, treat as approved
    const finalStepStatus = allApproved ? "approved" : (user?.stepApprovalStatus || "pending");

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

    // Define which document types belong to which step
    const stepDocTypes: Record<number, string[]> = {
        3: ["passport", "diploma", "transcript", "biometric_photo"], // Documents (Step 3)
        4: ["signed_contract"], // Contract (Step 4)
        5: ["passport_translation", "diploma_translation", "transcript_translation"], // Translation (Step 5)
    };

    // Get all user documents
    const userDocs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id)
    });

    // Filter by step if provided
    let relevantDocs = userDocs;
    if (step && stepDocTypes[step]) {
        relevantDocs = userDocs.filter(doc => stepDocTypes[step].includes(doc.type));
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

    return { success: true, message: "Belgeleriniz onaya gönderildi.", isInReview: true };
}
