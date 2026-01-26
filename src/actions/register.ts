"use server";

import * as z from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

const RegisterSchema = z.object({
    name: z.string().min(1, "İsim zorunludur"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Geçersiz alanlar!" };
        }

        const { email, password, name } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return { error: "Bu email adresi zaten kullanımda!" };
        }

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Onay emaili gönderildi!" };
    } catch (error) {
        console.error("REGISTRATION_ERROR:", error);
        return { error: "Sunucu hatası! Lütfen daha sonra tekrar deneyin." };
    }
};
