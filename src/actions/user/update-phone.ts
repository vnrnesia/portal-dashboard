"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserPhone(phone: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    if (!phone) {
        throw new Error("Telefon numarası gereklidir.");
    }

    try {
        await db.update(users)
            .set({
                phone,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        revalidatePath("/profile");
        revalidatePath("/documents");

        return { success: true };
    } catch (error) {
        console.error("Phone update error:", error);
        return { success: false, error: "Telefon numarası güncellenirken bir hata oluştu." };
    }
}
