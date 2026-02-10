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
        // Get current step to prevent regression
        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: { onboardingStep: true }
        });
        const currentStep = currentUser?.onboardingStep || 1;

        await db.update(users)
            .set({
                selectedProgram: program,
                // Only advance step if user is at step 1 or 2 (don't regress users past step 3)
                ...(currentStep <= 2 ? { onboardingStep: 3 } : {})
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
