"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Program } from "@/lib/data/programs";

export async function selectProgram(program: Program) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Oturum açmanız gerekiyor." };
    }

    try {
        await db.update(users)
            .set({
                selectedProgram: program,
                onboardingStep: 3 // Move to Evrak (Step 3) after selecting program
            })
            .where(eq(users.id, session.user.id));

        revalidatePath("/programs");
        revalidatePath("/dashboard");
        revalidatePath("/admin/users");

        return { success: true, message: "Program başarıyla seçildi." };
    } catch (error) {
        console.error("Program selection error:", error);
        return { success: false, message: "Program seçilirken hata oluştu." };
    }
}
