"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateStudentStep(userId: string, newStep: number) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.update(users)
        .set({ onboardingStep: newStep })
        .where(eq(users.id, userId));

    revalidatePath("/admin/users/" + userId);
    revalidatePath("/admin/dashboard");
}
