
import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.token, token),
        });
        return verificationToken;
    } catch {
        return null;
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.identifier, email),
        });
        return verificationToken;
    } catch {
        return null;
    }
}

export const generateVerificationToken = async (email: string) => {
    // Generate 6 digit code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));
    }

    await db.insert(verificationTokens).values({
        identifier: email,
        token,
        expires,
    });

    return { email, token, expires };
}
