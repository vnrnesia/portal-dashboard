"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { APPLICATION_STEPS } from "@/lib/constants";

const MAX_STEP = APPLICATION_STEPS.length; // 8

/**
 * Advance the current user's onboarding step (for self-progressing steps like program selection)
 */
export async function advanceUserStep(targetStep: number) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const currentStep = (session.user as any).onboardingStep || 1;

    // Prevent advancing past the maximum step
    if (targetStep > MAX_STEP) {
        throw new Error("Maksimum adıma ulaşıldı.");
    }

    // Only allow advancing to the next step (not skipping)
    if (targetStep !== currentStep + 1) {
        throw new Error("Geçersiz adım ilerlemesi.");
    }

    await db.update(users)
        .set({
            onboardingStep: targetStep,
            stepApprovalStatus: "pending"
        })
        .where(eq(users.id, session.user.id));

    // Revalidate all student routes so sidebar/pages update immediately
    revalidatePath("/dashboard");
    revalidatePath("/programs");
    revalidatePath("/documents");
    revalidatePath("/contract");
    revalidatePath("/translation");
    revalidatePath("/application-status");
    revalidatePath("/acceptance");
    revalidatePath("/flight");
    revalidatePath("/timeline");

    return { success: true };
}
