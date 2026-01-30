"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Advance the current user's onboarding step (for self-progressing steps like program selection)
 */
export async function advanceUserStep(targetStep: number) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const currentStep = (session.user as any).onboardingStep || 1;

    // Only allow advancing to the next step (not skipping)
    if (targetStep !== currentStep + 1) {
        throw new Error("Invalid step advancement");
    }

    await db.update(users)
        .set({
            onboardingStep: targetStep,
            stepApprovalStatus: "pending"
        })
        .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath("/programs");

    return { success: true };
}
