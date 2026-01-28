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

export async function getDocumentReviewStatus() {
    const session = await auth();
    if (!session?.user?.id) return { hasDocumentsInReview: false };

    const docs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id),
    });

    const hasDocumentsInReview = docs.some(doc => doc.status === "reviewing");
    const allApproved = docs.length > 0 && docs.every(doc => doc.status === "approved");

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

export async function submitDocumentsForReview() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Get all user documents
    const userDocs = await db.query.documents.findMany({
        where: eq(documents.userId, session.user.id)
    });

    // Check if any documents are already in reviewing or approved status
    const hasReviewingOrApproved = userDocs.some(
        doc => doc.status === "reviewing" || doc.status === "approved"
    );

    if (hasReviewingOrApproved) {
        return { success: false, message: "Belgeleriniz zaten inceleme aşamasında." };
    }

    // Check if all required documents are uploaded
    const uploadedDocs = userDocs.filter(doc => doc.status === "uploaded");
    if (uploadedDocs.length === 0) {
        return { success: false, message: "Lütfen en az bir belge yükleyiniz." };
    }

    // Update all uploaded documents to reviewing status
    await db.update(documents)
        .set({
            status: "reviewing",
            updatedAt: new Date()
        })
        .where(and(
            eq(documents.userId, session.user.id),
            eq(documents.status, "uploaded")
        ));

    // Update user's stepApprovalStatus to indicate documents are in review
    await db.update(users)
        .set({
            stepApprovalStatus: "pending",
            updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

    revalidatePath("/documents");
    revalidatePath("/contract");
    revalidatePath("/dashboard");

    return { success: true, message: "Belgeleriniz onaya gönderildi.", isInReview: true };
}
