
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {

    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
        console.log("---------------------------------------");
        console.log(`📨 [DEV MOCK EMAIL] To: ${email}`);
        console.log(`🔑 OTP Code: ${token}`);
        console.log("---------------------------------------");
        return;
    }

    await resend.emails.send({
        from: "onboarding@resend.dev", // Change this to your verify domain later
        to: email,
        subject: "Doğrulama Kodunuz",
        html: `<p>Portal giriş doğrulama kodunuz: <strong>${token}</strong></p><p>Bu kod 15 dakika geçerlidir.</p>`,
    });
};
