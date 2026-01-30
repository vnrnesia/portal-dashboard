"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MagicLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        const login = async () => {
            try {
                const result = await signIn("magic-token", {
                    token,
                    redirect: false
                });

                if (result?.ok) {
                    setStatus("success");
                    router.push("/dashboard");
                    router.refresh(); // Refresh to ensure session loads
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error("Magic login error:", error);
                setStatus("error");
            }
        };

        login();
    }, [token, router]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 font-medium">Giriş yapılıyor, lütfen bekleyin...</p>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
                <p className="text-green-600 font-medium">Giriş başarılı! Yönlendiriliyorsunuz...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-xl font-bold text-red-600 mb-2">Giriş Başarısız</h1>
                <p className="text-gray-600 mb-6">
                    Bu bağlantı geçersiz veya süresi dolmuş olabilir. Lütfen normal giriş yöntemini kullanın.
                </p>
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Giriş Sayfasına Git
                </button>
            </div>
        </div>
    );
}
