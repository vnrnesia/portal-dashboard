"use server";

import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveStudentStep(userId: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Get user and their current step
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { onboardingStep: true }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const currentStep = user.onboardingStep || 1;

    // Step-specific validation
    // Step 2: Documents - Check if at least some documents are uploaded
    if (currentStep === 2) {
        const userDocs = await db.query.documents.findMany({
            where: eq(documents.userId, userId),
        });

        const uploadedDocs = userDocs.filter(d => d.fileUrl && d.fileUrl.length > 0);

        if (uploadedDocs.length === 0) {
            throw new Error("Öğrenci henüz belge yüklemedi. Onay verilemez.");
        }
    }

    // Calculate new step
    const newStep = Math.min(currentStep + 1, 6);

    // Update user step
    await db.update(users)
        .set({
            stepApprovalStatus: "approved",
            onboardingStep: newStep,
        })
        .where(eq(users.id, userId));

    // Reset approval status to pending for the new step (unless we're at final step)
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
