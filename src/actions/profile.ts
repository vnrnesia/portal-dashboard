"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ProfileData {
    name?: string;
    phone?: string;
    secondaryPhone?: string;
    birthDate?: Date | null;
    nationality?: string;
    tcKimlik?: string;
    passportNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}

export async function getProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            secondaryPhone: true,
            birthDate: true,
            nationality: true,
            tcKimlik: true,
            passportNumber: true,
            address: true,
            city: true,
            country: true,
            postalCode: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
            emergencyContactRelation: true,
        }
    });

    return user;
}

export async function updateProfile(data: ProfileData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(users)
        .set({
            name: data.name,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,
            birthDate: data.birthDate,
            nationality: data.nationality,
            tcKimlik: data.tcKimlik,
            passportNumber: data.passportNumber,
            address: data.address,
            city: data.city,
            country: data.country,
            postalCode: data.postalCode,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            emergencyContactRelation: data.emergencyContactRelation,
            updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function updateProfileImage(imageUrl: string | null) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(users)
        .set({
            image: imageUrl,
            updatedAt: new Date()
        })
        .where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
}
