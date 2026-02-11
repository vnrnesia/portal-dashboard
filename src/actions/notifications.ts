"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type NotificationType =
    | "step_completed"
    | "document_approved"
    | "document_rejected"
    | "document_uploaded"
    | "application_update"
    | "general";

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
) {
    await db.insert(notifications).values({
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
    });

    // Send WhatsApp Notification (Fire and Forget)
    try {
        // Correct query:
        const userData = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns: { phone: true, name: true }
        });

        console.log("WhatsApp Notification Debug:", {
            userId,
            hasUser: !!userData,
            hasPhone: !!userData?.phone,
            phone: userData?.phone
        });

        if (userData?.phone) {
            const { sendWhatsAppText } = await import("@/lib/evolution-api");
            const { generateMagicLink } = await import("@/actions/magic-link");

            // Generate Magic Link
            const magicLink = await generateMagicLink(userId);

            const whatsappMessage = `*Sayın ${userData.name || 'Öğrenci'},*\n\n${title}\n\n${message}\n\nHızlı Giriş Linkiniz:\n${magicLink}\n\n_Giriş yapmak için yukarıdaki linke tıklayınız._`;

            // Do not await to avoid blocking UI
            sendWhatsAppText(userData.phone, whatsappMessage).catch(err => {
                console.error("WhatsApp send error:", err);
            });
        }
    } catch (error) {
        console.error("WhatsApp notification logic failed:", error);
    }

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
}

export async function getNotifications(limit?: number) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const query = db.query.notifications.findMany({
        where: eq(notifications.userId, session.user.id),
        orderBy: [desc(notifications.createdAt)],
        limit: limit || 50,
    });

    return query;
}

export async function getUnreadCount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    const unread = await db.query.notifications.findMany({
        where: and(
            eq(notifications.userId, session.user.id),
            eq(notifications.isRead, false)
        ),
    });

    return unread.length;
}

export async function markAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(notifications)
        .set({ isRead: true })
        .where(and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, session.user.id)
        ));

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, session.user.id));

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
}

export async function deleteNotification(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.delete(notifications)
        .where(and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, session.user.id)
        ));

    revalidatePath("/notifications");
}
