"use server";

import { db } from "@/db";
import { documents } from "@/db/schema";
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
