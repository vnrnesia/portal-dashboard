"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserPhone(phone: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    if (!phone) {
        throw new Error("Telefon numarası gereklidir.");
    }

    try {
        // Check if user already had a phone (to avoid duplicate welcome messages)
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: { phone: true, name: true }
        });

        const hadPhoneBefore = !!existingUser?.phone;

        await db.update(users)
            .set({
                phone,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        // Send WhatsApp welcome message if this is the first time saving phone
        if (!hadPhoneBefore) {
            try {
                const { sendWhatsAppText } = await import("@/lib/evolution-api");
                const { generateMagicLink } = await import("@/actions/magic-link");

                const magicLink = await generateMagicLink(session.user.id);
                const userName = existingUser?.name || "Öğrenci";

                const welcomeMessage = `*Hoş geldiniz, ${userName}!* 🎓\n\nStudent Consultancy Portal'a telefon numaranız başarıyla kaydedildi.\n\n📱 Bu numara üzerinden:\n• Evrak durumunuz hakkında bildirim alacaksınız\n• Süreçlerinizle ilgili destek alabileceksiniz\n\n🔗 *Hızlı Giriş:* ${magicLink}\n_Panele giriş yapmak için linke tıklayınız._`;

                sendWhatsAppText(phone, welcomeMessage).catch(err => {
                    console.error("WhatsApp welcome message error:", err);
                });
            } catch (error) {
                console.error("WhatsApp welcome logic failed:", error);
            }
        }

        revalidatePath("/profile");
        revalidatePath("/documents");

        return { success: true };
    } catch (error) {
        console.error("Phone update error:", error);
        return { success: false, error: "Telefon numarası güncellenirken bir hata oluştu." };
    }
}
