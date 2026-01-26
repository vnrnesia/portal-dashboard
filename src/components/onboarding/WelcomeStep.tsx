"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/stores/useOnboardingStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export function WelcomeStep() {
    const { nextStep } = useOnboardingStore();
    const { user } = useAuthStore();

    return (
        <div className="text-center space-y-6 py-10">
            <h2 className="text-3xl font-bold text-gray-900">
                Hoş geldin, <span className="text-primary">{user?.name || "Geleceğin Lideri"}</span>! 🚀
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Hayallerindeki eğitime ulaşmak için sana özel bir yol haritası çıkarmamıza izin ver.
                Yapay zeka asistanımız hedeflerini analiz edip en uygun seçenekleri sunacak.
            </p>

            <div className="pt-6">
                <Button onClick={nextStep} size="lg" className="w-48 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                    Başlayalım
                </Button>
            </div>
        </div>
    );
}
