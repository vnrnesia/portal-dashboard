"use client";

import { useActionState } from "react";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Lütfen giriş yapmak için e-posta adresinizi girin.
                </p>
            </div>

            <div className="grid gap-6">
                <form action={dispatch}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                E-posta
                            </label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="isim@ornek.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isPending}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                disabled={isPending}
                            />
                        </div>

                        {errorMessage && (
                            <div className="flex items-center space-x-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/10">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <Button disabled={isPending} className="bg-primary hover:bg-primary/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Giriş Yap
                        </Button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-50 dark:bg-zinc-900 px-2 text-muted-foreground">
                            Veya şununla devam et
                        </span>
                    </div>
                </div>

                <Button variant="outline" type="button" disabled={isPending} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google İle Giriş Yap
                </Button>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link href="/register" className="hover:text-primary underline underline-offset-4">
                    Hesabın yok mu? Kayıt Ol
                </Link>
            </p>
        </div>
    );
}
