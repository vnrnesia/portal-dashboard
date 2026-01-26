"use client";

import { useOnboardingStore } from "@/lib/stores/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Pencil, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConfirmationStep() {
    const { data, prevStep } = useOnboardingStore();
    const router = useRouter();

    const handleConfirm = () => {
        // Navigate to dashboard
        router.push("/dashboard");
    };

    const items = [
        { label: "Hedef Bölüm", value: data.program },
        { label: "Hedef Ülke", value: data.country },
        { label: "Eğitim Dili", value: data.language },
        { label: "Tahmini Bütçe", value: data.budget },
        { label: "Başlangıç", value: data.startDate },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Rotan Oluşturuldu!</h2>
                <p className="text-gray-500 mt-2">
                    Yapay zeka analizimize göre senin için oluşturduğumuz profil aşağıdadır.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <Card key={index} className="p-4 flex flex-col space-y-1 hover:shadow-md transition-shadow">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className="font-semibold text-lg text-gray-900">{item.value || "Belirtilmedi"}</span>
                    </Card>
                ))}
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" size="lg" className="flex-1" onClick={prevStep}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Düzenle
                </Button>
                <Button onClick={handleConfirm} size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                    Onayla ve Devam Et
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
