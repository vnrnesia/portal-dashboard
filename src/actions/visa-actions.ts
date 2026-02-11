"use server";

import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadVisaReceipt(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Oturum açmanız gerekiyor." };

    const code = formData.get("code") as string;
    const file = formData.get("file") as File;

    if (!code) {
        return { success: false, message: "Lütfen takip kodunu giriniz." };
    }

    try {
        await db.update(users)
            .set({
                visaTrackingCode: code,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), "uploads");
            await mkdir(uploadDir, { recursive: true });

            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extension = file.name.split('.').pop();
            const fileName = `receipt-${session.user.id}-${uniqueSuffix}.${extension}`;
            const filePath = join(uploadDir, fileName);
            const fileUrl = `/api/uploads/${fileName}`;

            await writeFile(filePath, buffer);

            const existingDoc = await db.query.documents.findFirst({
                where: and(
                    eq(documents.userId, session.user.id),
                    eq(documents.type, "visa_receipt")
                )
            });

            if (existingDoc) {
                await db.update(documents)
                    .set({
                        fileName: file.name,
                        fileUrl: fileUrl,
                        status: "uploaded",
                        updatedAt: new Date()
                    })
                    .where(eq(documents.id, existingDoc.id));
            } else {
                await db.insert(documents).values({
                    userId: session.user.id,
                    type: "visa_receipt",
                    label: "Vize Kargo Makbuzu",
                    fileName: file.name,
                    fileUrl: fileUrl,
                    status: "uploaded"
                });
            }
        }

        revalidatePath("/acceptance");
        revalidatePath("/admin/users");

        return { success: true, message: "Bilgiler başarıyla kaydedildi." };
    } catch (error) {
        console.error("Visa upload error:", error);
        return { success: false, message: "Bir hata oluştu." };
    }
}
