import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isLoginPage = nextUrl.pathname.startsWith("/login")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isLoginPage) {
                if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
                return true
            }

            return true
        },
    },
    providers: [], // Providers are configured in auth.ts (Node.js runtime)
} satisfies NextAuthConfig
