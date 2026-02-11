"use server";

import { db } from "@/db";
import { magicLinks } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function generateMagicLink(userId: string) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity

    await db.insert(magicLinks).values({
        userId,
        token,
        expiresAt
    });

    // Determine base URL from environment
    const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3000";
    return `${baseUrl}/magic-login?token=${token}`;
}
