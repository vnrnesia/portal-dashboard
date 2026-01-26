"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingStore } from "@/lib/stores/useOnboardingStore";
import { Loader2, Sparkles } from "lucide-react";

export function AIInputStep() {
    const { nextStep, setData } = useOnboardingStore();
    const [input, setInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        setIsAnalyzing(true);

        // Simulate AI parsing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock parsing logic based on keywords
        const lowerInput = input.toLowerCase();
        const newData = {
            rawInput: input,
            program: lowerInput.includes("mühendis") ? "Bilgisayar Mühendisliği" :
                lowerInput.includes("tıp") ? "Tıp" :
                    lowerInput.includes("işletme") ? "İşletme" : "Genel Başvuru",
            country: lowerInput.includes("almanya") ? "Almanya" :
                lowerInput.includes("ingiltere") ? "İngiltere" :
                    lowerInput.includes("polonya") ? "Polonya" : "Belirtilmedi",
            budget: lowerInput.includes("bütçe") ? "10.000€ - 20.000€" : "Belirtilmedi",
            language: lowerInput.includes("ingilizce") ? "İngilizce" : "Rusça",
            startDate: "Sonbahar 2025" // Default mock
        };

        setData(newData);
        setIsAnalyzing(false);
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="text-primary" />
                    Hayallerini Anlat
                </h2>
                <p className="text-gray-500">
                    Hangi bölümü okumak istiyorsun? Aklında bir ülke var mı? Bütçen nedir?
                    Sadece yaz, gerisini bize bırak.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <Textarea
                    placeholder="Örneğin: Almanya'da bilgisayar mühendisliği okumak istiyorum. Bütçem yıllık 15.000 Euro civarında. İngilizce eğitim almak istiyorum..."
                    className="min-h-[200px] text-lg p-4 resize-none border-0 focus-visible:ring-0 bg-gray-50 rounded-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || isAnalyzing}
                    size="lg"
                    className="w-full md:w-auto min-w-[150px]"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analiz Ediliyor...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Yapay Zeka İle Analiz Et
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
