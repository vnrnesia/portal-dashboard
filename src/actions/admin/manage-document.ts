"use server";

import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateDocumentStatus(docId: string, status: "approved" | "rejected", reason?: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.update(documents)
        .set({
            status: status,
            rejectionReason: reason || null
        })
        .where(eq(documents.id, docId));

    revalidatePath("/admin/dashboard"); // Revalidate broadly just in case
}
