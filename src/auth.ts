import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { compare } from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

// User schema for validation
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db) as any,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = await signInSchema.safeParseAsync(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) {
            // Prevent login if email is not verified
            if (!user.emailVerified) return null;

            return {
              ...user,
              role: user.role || "student",
              onboardingStep: user.onboardingStep || 1,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "student";
        token.id = user.id;
        token.onboardingStep = (user as any).onboardingStep || 1;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "student" | "admin";
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.onboardingStep = token.onboardingStep as number;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, user.id!)
      });

      // Prevent sign in if email is not verified
      if (!existingUser?.emailVerified) return false;

      return true;
    }
  },
})
