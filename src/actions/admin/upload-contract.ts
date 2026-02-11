"use server";

import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createNotification } from "@/actions/notifications";

// Step 4 (Sözleşme) -> Step 5 (Tercüme) when admin uploads contract
const STEP_AFTER_CONTRACT = 5;

export async function uploadAdminContract(userId: string, formData: FormData) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        return { success: false, message: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, message: "Dosya bulunamadı." };
    }

    // Check if student has uploaded a signed contract
    const studentDocs = await db.query.documents.findMany({
        where: eq(documents.userId, userId)
    });

    const hasSignedContract = studentDocs.some(d => d.type === "signed_contract");

    if (!hasSignedContract) {
        return { success: false, message: "Öğrenci imzalı sözleşmeyi sisteme yüklemeden onaylı sözleşme yükleyemezsiniz." };
    }

    try {
        // File upload logic - write to disk
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.name.split('.').pop();
        const fileName = `contract-${userId}-${uniqueSuffix}.${extension}`;
        const filePath = join(uploadDir, fileName);
        const fileUrl = `/uploads/${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Check if exists
        const existing = await db.query.documents.findFirst({
            where: and(
                eq(documents.userId, userId),
                eq(documents.type, "admin_contract")
            )
        });

        if (existing) {
            await db.update(documents)
                .set({
                    status: "approved",
                    fileName: file.name,
                    fileUrl: fileUrl,
                    updatedAt: new Date()
                })
                .where(eq(documents.id, existing.id));
        } else {
            await db.insert(documents).values({
                userId: userId,
                type: "admin_contract",
                label: "Yönetici Sözleşmesi",
                status: "approved",
                fileName: file.name,
                fileUrl: fileUrl
            });
        }

        // Get current user step
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { onboardingStep: true }
        });

        // Auto-advance to next step if user is on step 4 (Sözleşme)
        if (user && user.onboardingStep === 4) {
            await db.update(users)
                .set({ onboardingStep: STEP_AFTER_CONTRACT })
                .where(eq(users.id, userId));
        }

        // Send notification to student about signed contract
        await createNotification(
            userId,
            "document_approved",
            "İmzalı Sözleşmeniz Yüklendi 📄",
            "İmzalı sözleşmeniz sisteme yüklenmiştir. Sözleşmenizi panelden görüntüleyebilir ve bir sonraki adıma geçebilirsiniz. Herhangi bir sorunuz olursa bize ulaşabilirsiniz.",
            { documentType: "admin_contract" }
        );

        revalidatePath("/admin/dashboard");
        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/contract");

        return { success: true, message: "Sözleşme yüklendi ve öğrenci bir sonraki aşamaya geçirildi." };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Veritabanı hatası." };
    }
}

