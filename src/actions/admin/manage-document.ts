"use server";

import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateDocumentStatus(docId: string, status: "approved" | "rejected", reason?: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.update(documents)
        .set({
            status: status,
            rejectionReason: reason || null,
            updatedAt: new Date()
        })
        .where(eq(documents.id, docId));

    // Auto-check for step completion
    // 1. Get the document to find the user
    const doc = await db.query.documents.findFirst({
        where: eq(documents.id, docId),
        with: {
            user: true
        }
    });

    if (doc && doc.user && status === "approved") {
        const userId = doc.userId;
        const currentStep = doc.user.onboardingStep;

        const { STEP_REQUIREMENTS } = await import("@/lib/constants");
        const requirements = STEP_REQUIREMENTS[currentStep] || [];

        if (requirements.length > 0) {
            // Check if all required docs are approved
            const userDocs = await db.query.documents.findMany({
                where: eq(documents.userId, userId)
            });

            const allApproved = requirements.every(reqType =>
                userDocs.some(d => d.type === reqType && d.status === "approved")
            );

            if (allApproved) {
                const { users } = await import("@/db/schema");
                await db.update(users)
                    .set({ stepApprovalStatus: "approved" })
                    .where(eq(users.id, userId));
            }
        }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");
}
