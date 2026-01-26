"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function DetailedTimeline({ currentStep = 1 }: { currentStep?: number }) {
    // Step mapping:
    // 1: Programs
    // 2: Documents
    // 3: Contract
    // 4: Translation
    // 5: Application
    // 6: Flight/Timeline

    // Visual Timeline Steps
    const steps = [
        { id: -1, title: "Kayıt Ol", desc: "Sisteme kayıt işlemleri tamamlandı.", date: "Tamamlandı", status: "completed" },
        // Step 1: Program Seçimi
        {
            id: 1,
            title: "Program Seçimi",
            desc: "Üniversite ve bölüm seçimi.",
            status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "locked"
        },
        // Step 2: Evrak Toplama
        {
            id: 2,
            title: "Evrak Toplama",
            desc: "Gerekli belgelerin yüklenmesi.",
            status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "locked"
        },
        // Step 3: Sözleşme Onayı
        {
            id: 3,
            title: "Sözleşme Onayı",
            desc: "Hizmet sözleşmesinin onaylanması.",
            status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "locked"
        },
        // Step 4: Yeminli Tercüme
        {
            id: 4,
            title: "Yeminli Tercüme",
            desc: "Belgelerin tercüme işlemleri.",
            status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "locked"
        },
        // Step 5: Üniversite Başvurusu
        {
            id: 5,
            title: "Üniversite Başvurusu",
            desc: "Resmi başvuru süreci.",
            status: currentStep > 5 ? "completed" : currentStep === 5 ? "current" : "locked"
        },
        // Step 6: Uçuş ve Konaklama
        {
            id: 6,
            title: "Uçuş ve Konaklama",
            desc: "Yeni hayatına merhaba de!",
            status: currentStep > 6 ? "completed" : currentStep === 6 ? "current" : "locked"
        },
    ];

    return (
        <Card className="p-6 h-fit bg-white border shadow-sm">
            <h3 className="font-semibold text-lg mb-1">Başvuru Süreci</h3>
            <p className="text-sm text-gray-500 mb-6">Eğitim yolculuğunun tüm adımlarını buradan takip edebilirsin.</p>

            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                        {/* Line & Icon */}
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white shrink-0",
                                step.status === "completed" && "bg-green-600 border-green-600 text-white",
                                step.status === "current" && "border-primary text-primary animate-pulse",
                                (step.status === "pending" || step.status === "locked") && "border-gray-200 text-gray-300"
                            )}>
                                {step.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> :
                                    step.status === "current" ? <Clock className="w-4 h-4" /> :
                                        <Circle className="w-4 h-4" />}
                            </div>
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "w-[2px] h-full min-h-[40px] -my-1",
                                    step.status === "completed" ? "bg-green-600" : "bg-gray-200"
                                )}></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "flex-1 mb-6 pb-2",
                            step.status === "locked" && "opacity-50"
                        )}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={cn("font-medium text-sm leading-none", step.status === "completed" ? "text-green-700" : "text-gray-900")}>
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">{step.desc}</p>
                                </div>
                                {/* Optional Date Display */}
                                {step.status === "completed" && step.id !== -1 && (
                                    <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 ml-2 whitespace-nowrap">
                                        Tamamlandı
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
