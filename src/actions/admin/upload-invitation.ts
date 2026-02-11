"use server";

import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Step 6 (Başvuru) -> Step 7 (Kabul & Vize) when invitation letter uploaded
const STEP_AFTER_INVITATION = 7;

export async function uploadInvitationLetter(userId: string, formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return { success: false, message: "Yetkisiz işlem." };
        }

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, message: "Dosya bulunamadı." };
        }

        // Check for approved translation documents
        const studentDocs = await db.query.documents.findMany({
            where: eq(documents.userId, userId)
        });

        // Get user for step check
        const userCheck = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { onboardingStep: true }
        });

        const hasApprovedTranslations = studentDocs.some(d =>
            d.type.startsWith("translated_") && d.status === "approved"
        ) || (userCheck?.onboardingStep || 0) > 5;

        if (!hasApprovedTranslations) {
            return { success: false, message: "Öğrencinin onaylı tercüme evrakları bulunmadan davet mektubu yüklenemez." };
        }

        // File upload logic - write to disk
        const uploadDir = join(process.cwd(), "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.name.split('.').pop();
        const fileName = `invitation-${userId}-${uniqueSuffix}.${extension}`;
        const filePath = join(uploadDir, fileName);
        const fileUrl = `/api/uploads/${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Check if invitation letter already exists
        const existingDoc = await db.query.documents.findFirst({
            where: and(
                eq(documents.userId, userId),
                eq(documents.type, "invitation_letter")
            )
        });

        if (existingDoc) {
            await db.update(documents)
                .set({
                    fileName,
                    fileUrl,
                    updatedAt: new Date(),
                    status: "approved"
                })
                .where(eq(documents.id, existingDoc.id));
        } else {
            await db.insert(documents).values({
                userId,
                type: "invitation_letter",
                label: "Davet Mektubu",
                fileName,
                fileUrl,
                status: "approved"
            });
        }

        // Get current user step
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { onboardingStep: true }
        });

        // Auto-advance to next step if user is on step 6 (Başvuru)
        if (user && user.onboardingStep === 6) {
            await db.update(users)
                .set({ onboardingStep: STEP_AFTER_INVITATION })
                .where(eq(users.id, userId));
        }

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/admin/dashboard");
        revalidatePath("/application-status");

        return { success: true, message: "Davet mektubu yüklendi ve öğrenci bir sonraki aşamaya geçirildi." };

    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, message: "Dosya yüklenirken bir hata oluştu." };
    }
}
