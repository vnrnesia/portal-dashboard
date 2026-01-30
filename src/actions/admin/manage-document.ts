"use server";

import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/notifications";

export async function updateDocumentStatus(docId: string, status: "approved" | "rejected", reason?: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Get document info before update
    const doc = await db.query.documents.findFirst({
        where: eq(documents.id, docId),
        with: {
            user: true
        }
    });

    await db.update(documents)
        .set({
            status: status,
            rejectionReason: reason || null,
            updatedAt: new Date()
        })
        .where(eq(documents.id, docId));

    // Create notification for student
    if (doc && doc.userId) {
        // REMOVED: Individual approval notification
        // Only send immediate notification for rejection
        if (status === "rejected") {
            await createNotification(
                doc.userId,
                "document_rejected",
                "Belgeniz Reddedildi",
                `${doc.label} belgeniz reddedildi. ${reason ? `Sebep: ${reason}` : "Lütfen belgeyi yeniden yükleyin."}`,
                { documentId: docId, documentType: doc.type, reason }
            );
        }
    }

    // Auto-check for step completion
    if (doc && doc.user && status === "approved") {
        const userId = doc.userId;
        const currentStep = doc.user.onboardingStep || 1;

        const { STEP_REQUIREMENTS } = await import("@/lib/constants");
        const requirements = STEP_REQUIREMENTS[currentStep] || [];

        if (requirements.length > 0) {
            // Check if all required docs are approved
            const userDocs = await db.query.documents.findMany({
                where: eq(documents.userId, userId)
            });

            const allApproved = requirements.every((reqType: string) =>
                userDocs.some(d => d.type === reqType && d.status === "approved")
            );

            if (allApproved) {
                const { users } = await import("@/db/schema");
                await db.update(users)
                    .set({ stepApprovalStatus: "approved" })
                    .where(eq(users.id, userId));

                // Send Step Completion Notification
                let title = "Tüm Evraklar Onaylandı";
                let message = "Bulunduğunuz aşamadaki tüm belgeleriniz onaylanmıştır.";

                // Custom messages per step
                if (currentStep === 3) {
                    message = "Tüm evraklarınız onaylandı. Sözleşme adımına başarıyla geçtiniz.";
                } else if (currentStep === 5) {
                    message = "Tüm evraklarınız başarıyla onaylandı. Evraklarınız üniversiteye iletilecektir. Bu işlem yaklaşık 15 gün sürebilir.";
                }

                await createNotification(
                    userId,
                    "step_completed",
                    title,
                    message,
                    { step: currentStep }
                );
            }
        }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");
}
