"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { newVerification } from "@/actions/new-verification";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function NewVerificationContent() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Token bulunamadı!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Bir şeyler ters gitti!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            {!success && !error && (
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            )}
            {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-500">
                    {success}
                </div>
            )}
            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}

export default function NewVerificationPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md text-center">
                <h1 className="text-2xl font-bold">Doğrulama Durumu</h1>

                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                }>
                    <NewVerificationContent />
                </Suspense>

                <div>
                    <Link href="/login" className="text-sm text-secondary hover:underline">
                        Giriş yapmaya geri dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
