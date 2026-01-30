"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Step 7 (Kabul & Vize) -> Step 8 (Uçuş) when flight ticket uploaded
const STEP_AFTER_FLIGHT = 8;

export async function uploadFlightTicket(userId: string, formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return { success: false, message: "Yetkisiz işlem." };
        }

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, message: "Dosya bulunamadı." };
        }

        // File upload logic
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.name.split('.').pop();
        const fileName = `flight-${userId}-${uniqueSuffix}.${extension}`;
        const filePath = join(uploadDir, fileName);
        const fileUrl = `/uploads/${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Check if ticket already exists
        const existingDoc = await db.query.documents.findFirst({
            where: and(
                eq(documents.userId, userId),
                eq(documents.type, "flight_ticket")
            )
        });

        if (existingDoc) {
            await db.update(documents)
                .set({
                    fileName: file.name,
                    fileUrl,
                    status: "approved",
                    updatedAt: new Date()
                })
                .where(eq(documents.id, existingDoc.id));
        } else {
            await db.insert(documents).values({
                userId,
                type: "flight_ticket",
                label: "Uçuş Bileti",
                fileName: file.name,
                fileUrl,
                status: "approved"
            });
        }

        // Get current user step
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { onboardingStep: true }
        });

        // Auto-advance to next step if user is on step 7 (Kabul & Vize)
        if (user && user.onboardingStep === 7) {
            await db.update(users)
                .set({ onboardingStep: STEP_AFTER_FLIGHT })
                .where(eq(users.id, userId));
        }

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath(`/admin/dashboard`);
        revalidatePath("/flight");

        return { success: true, message: "Uçuş bileti yüklendi ve öğrenci bir sonraki aşamaya geçirildi." };

    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, message: "Yükleme hatası." };
    }
}
