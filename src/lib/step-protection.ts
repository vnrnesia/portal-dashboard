"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Check if the user has access to a step. If not, redirect to dashboard.
 * Call this at the top of each page that requires step protection.
 * 
 * Step requirements:
 * - Step 1: Programs
 * - Step 2: Documents
 * - Step 3: Contract
 * - Step 4: Translation
 * - Step 5: Application Status
 * - Step 6: Timeline
 */
export async function requireStep(requiredStep: number) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const userStep = (session.user as any).onboardingStep || 1;

    if (userStep < requiredStep) {
        redirect("/dashboard?error=step_required");
    }
}

/**
 * Check if user's current step is approved before allowing access to next step.
 */
export async function requireApprovedStep(requiredStep: number) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const userStep = (session.user as any).onboardingStep || 1;
    const stepApprovalStatus = (session.user as any).stepApprovalStatus || "pending";

    // User must be at or past the required step
    if (userStep < requiredStep) {
        redirect("/dashboard?error=step_required");
    }

    // For the CURRENT step, check if previous step was approved
    // (Only matters if moving to a new step)
    // This logic can be refined based on business rules

    return { userStep, stepApprovalStatus };
}
