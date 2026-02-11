import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user

            const isLoginPage = nextUrl.pathname.startsWith("/login")
            const isRegisterPage = nextUrl.pathname.startsWith("/register")

            // Protected routes that require authentication
            const protectedPrefixes = ["/dashboard", "/documents", "/contract", "/translation", "/programs", "/application-status", "/acceptance", "/flight", "/timeline", "/profile", "/notifications", "/admin"]
            const isProtectedRoute = protectedPrefixes.some(route => nextUrl.pathname.startsWith(route))

            // Protected routes: require login
            if (isProtectedRoute) {
                if (!isLoggedIn) return false // redirect to login
                return true
            }

            // Login/Register page: redirect logged-in users to dashboard
            // (admin redirect happens at layout level since Edge can't read role)
            if (isLoginPage || isRegisterPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            return true
        },
    },
    providers: [], // Providers are configured in auth.ts (Node.js runtime)
} satisfies NextAuthConfig


