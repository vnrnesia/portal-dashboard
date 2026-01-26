"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getVerificationTokenByToken } from "@/lib/tokens";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token bulunamadı veya süresi dolmuş." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token süresi dolmuş." };
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.identifier),
    });

    if (!existingUser) {
        return { error: "E-posta bulunamadı." };
    }

    await db.update(users)
        .set({ emailVerified: new Date(), email: existingToken.identifier })
        .where(eq(users.id, existingUser.id));

    // Optional: Delete verification token after usage
    // await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id));

    return { success: "E-posta başarıyla doğrulandı!" };
}
