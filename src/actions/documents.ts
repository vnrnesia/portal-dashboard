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
        2: ["passport", "diploma", "transcript", "biometric_photo"], // Documents
        3: ["signed_contract"], // Contract
        4: ["passport_translation", "diploma_translation", "transcript_translation"], // Translation
    };

    // If step is provided, filter by that step's document types
    let relevantDocs = docs;
    if (step && stepDocTypes[step]) {
        relevantDocs = docs.filter(doc => stepDocTypes[step].includes(doc.type));
    }

    const hasDocumentsInReview = relevantDocs.some(doc => doc.status === "reviewing");
    const allApproved = relevantDocs.length > 0 && relevantDocs.every(doc => doc.status === "approved");

    return { hasDocumentsInReview, allApproved };
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
            fileUrl
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

    if (existing) {
        await db.update(documents)
            .set({
                status: "uploaded",
                fileName,
                fileUrl,
                updatedAt: new Date()
            })
            .where(eq(documents.id, existing.id));
    } else {
        await db.insert(documents).values({
            userId: session.user.id,
            type,
            label,
            status: "uploaded",
            fileName,
            fileUrl
        });
    }

    revalidatePath("/documents");
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
        2: ["passport", "diploma", "transcript", "biometric_photo"], // Documents
        3: ["signed_contract"], // Contract
        4: ["passport_translation", "diploma_translation", "transcript_translation"], // Translation
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

    // Check if any relevant documents are already in reviewing or approved status
    const hasReviewingOrApproved = relevantDocs.some(
        doc => doc.status === "reviewing" || doc.status === "approved"
    );

    if (hasReviewingOrApproved) {
        return { success: false, message: "Belgeleriniz zaten inceleme aşamasında." };
    }

    // Check if all required documents are uploaded
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
