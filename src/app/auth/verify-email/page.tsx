"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp } from "@/actions/verify-otp";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const [code, setCode] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (code.length !== 6) return;

        startTransition(() => {
            verifyOtp(code)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    } else {
                        toast.success("Hesap doğrulandı!");
                        router.push("/login"); // Or dashboard
                    }
                })
                .catch(() => toast.error("Bir hata oluştu!"));
        });
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md text-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Doğrulama Kodu</h1>
                    <p className="text-gray-500">
                        E-posta adresinize gönderilen 6 haneli kodu giriniz.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
                    <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(val) => setCode(val)}
                        disabled={isPending}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <Button type="submit" disabled={isPending || code.length !== 6} className="w-full bg-primary">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Doğrula
                    </Button>
                </form>
            </div>
        </div>
    );
}
