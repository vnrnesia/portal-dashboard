"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("ogrenci@ornek.com");
    const [password, setPassword] = useState("123456");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        await login(email, password);
        toast.success("Giriş yapıldı!");
        router.push("/dashboard");
        setIsLoading(false);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.info("Google ile giriş şu an demo modunda.");
        }, 1000);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Lütfen giriş yapmak için e-posta adresinizi girin.
                </p>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                E-posta
                            </label>
                            <Input
                                id="email"
                                placeholder="isim@ornek.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                type="password"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading} className="bg-primary hover:bg-primary/90">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

                <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogin}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                    )}
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
