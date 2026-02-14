"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

// Generate completion dates for steps (days before today)
export function DetailedTimeline({ currentStep = 1 }: { currentStep?: number }) {
    // Visual Timeline Steps
    // Dynamic Steps Generation
    const steps = [
        { id: 1, title: "Kayıt İşlemleri", desc: "Sisteme kayıt ve profil oluşturma." },
        { id: 2, title: "Program Seçimi", desc: "Üniversite ve bölüm tercihleri." },
        { id: 3, title: "Evrak Yükleme", desc: "Gerekli belgelerin sisteme yüklenmesi." },
        { id: 4, title: "Sözleşme Onayı", desc: "Hizmet sözleşmesinin incelenip onaylanması." },
        { id: 5, title: "Tercüme İşlemleri", desc: "Belgelerin yeminli tercümesi." },
        { id: 6, title: "Üniversite Başvurusu", desc: "Resmi başvuruların yapılması." },
        { id: 7, title: "Kabul ve Vize", desc: "Kabul mektubu ve vize süreçleri." },
        { id: 8, title: "Uçuş ve Karşılama", desc: "Yeni hayatına başlangıç." }
    ].map(step => ({
        ...step,
        status: currentStep > step.id ? "completed" : currentStep === step.id ? "current" : "pending",
        date: currentStep > step.id ? "Tamamlandı" : currentStep === step.id ? "İşlemde" : null
    }));

    return (
        <Card className="p-6 h-fit bg-card border shadow-sm">
            <h3 className="font-semibold text-lg mb-1">Başvuru Süreci</h3>
            <p className="text-sm text-muted-foreground mb-6">Eğitim yolculuğunun tüm adımlarını buradan takip edebilirsin.</p>

            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                        {/* Line & Icon */}
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-card shrink-0",
                                step.status === "completed" && "bg-green-600 border-green-600 text-white",
                                step.status === "current" && "border-primary text-primary animate-pulse",
                                (step.status === "pending" || step.status === "locked") && "border-muted text-muted-foreground"
                            )}>
                                {step.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> :
                                    step.status === "current" ? <Clock className="w-4 h-4" /> :
                                        <Circle className="w-4 h-4" />}
                            </div>
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "w-[2px] h-full min-h-[40px] -my-1",
                                    step.status === "completed" ? "bg-green-600" : "bg-muted"
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
                                    <h4 className={cn("font-medium text-sm leading-none", step.status === "completed" ? "text-green-600 dark:text-green-500" : "text-foreground")}>
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{step.desc}</p>
                                </div>
                                {/* Date Display */}
                                {step.date && (
                                    <span className={cn(
                                        "text-[10px] font-medium px-1.5 py-0.5 rounded border ml-2 whitespace-nowrap",
                                        step.date === "Bugün"
                                            ? "text-primary bg-primary/5 border-primary/20"
                                            : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
                                    )}>
                                        {step.date}
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

