"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function advanceStep(targetStep: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Oturum açmanız gerekiyor." };
    }

    try {
        // Simple logic: only allow moving forward one step at a time, or jump if admin allows. 
        // For now, we trust the client's targetStep but ensure it doesn't skip too far if we wanted strict logic.
        // Here we just update to the target step if it's greater than current.

        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        });

        if (!currentUser) return { success: false, message: "Kullanıcı bulunamadı." };

        const currentStep = currentUser.onboardingStep || 1;

        // Only allow advancing to the immediate next step (prevent skipping)
        if (targetStep !== currentStep + 1) {
            return {
                success: false,
                message: "Sadece bir sonraki adıma geçebilirsiniz."
            };
        }

        // Update to next step
        await db.update(users)
            .set({ onboardingStep: targetStep })
            .where(eq(users.id, session.user.id));

        revalidatePath("/");
        return { success: true };

    } catch (error) {
        console.error("Step update error:", error);
        return { success: false, message: "Adım güncellenirken hata oluştu." };
    }
}
