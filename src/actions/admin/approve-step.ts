"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveStudentStep(userId: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Approve current step and increment to next step
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { onboardingStep: true }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const newStep = Math.min((user.onboardingStep || 1) + 1, 6);

    await db.update(users)
        .set({
            stepApprovalStatus: "approved",
            onboardingStep: newStep,
        })
        .where(eq(users.id, userId));

    // Reset approval status to pending for the new step
    if (newStep < 6) {
        await db.update(users)
            .set({ stepApprovalStatus: "pending" })
            .where(eq(users.id, userId));
    }

    revalidatePath("/admin/users/" + userId);
    revalidatePath("/admin/dashboard");
}

export async function rejectStudentStep(userId: string, reason?: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.update(users)
        .set({
            stepApprovalStatus: "rejected",
        })
        .where(eq(users.id, userId));

    revalidatePath("/admin/users/" + userId);
    revalidatePath("/admin/dashboard");
}
