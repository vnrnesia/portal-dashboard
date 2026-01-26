import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role: "student" | "admin"
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    role: "student" | "admin"
  }
}
