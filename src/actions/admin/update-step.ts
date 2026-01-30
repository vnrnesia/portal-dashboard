"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/notifications";
import { APPLICATION_STEPS } from "@/lib/constants";

export async function updateStudentStep(userId: string, newStep: number) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Get current step for comparison
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    const oldStep = user?.onboardingStep || 1;

    await db.update(users)
        .set({ onboardingStep: newStep })
        .where(eq(users.id, userId));

    // Create notification if step changed
    if (oldStep !== newStep) {
        const stepInfo = APPLICATION_STEPS.find(s => s.id === newStep);

        if (newStep > oldStep) {
            // Moving forward
            await createNotification(
                userId,
                "step_completed",
                "Yeni Aşamaya Geçtiniz! 🎉",
                `Tebrikler! ${stepInfo?.label || `Aşama ${newStep}`} aşamasına geçtiniz.`,
                { newStep, oldStep }
            );
        } else {
            // Rolling back
            await createNotification(
                userId,
                "application_update",
                "Aşama Güncellendi",
                `Başvurunuz ${stepInfo?.label || `Aşama ${newStep}`} aşamasına geri alındı.`,
                { newStep, oldStep }
            );
        }
    }

    revalidatePath("/admin/users/" + userId);
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
}
