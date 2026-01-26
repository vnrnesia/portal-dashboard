"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function DetailedTimeline() {
    const steps = [
        { id: 1, title: "Kayıt Ol", desc: "Sisteme kayıt işlemleri tamamlandı.", date: "20 Ocak 2026", status: "completed" },
        { id: 2, title: "Hedef Analizi", desc: "Yapay zeka ile hedef belirleme yapıldı.", date: "20 Ocak 2026", status: "completed" },
        { id: 3, title: "Program Seçimi", desc: "Münih Teknik Üniversitesi seçildi.", date: "22 Ocak 2026", status: "completed" },
        { id: 4, title: "Sözleşme Onayı", desc: "Hizmet sözleşmesi dijital olarak onaylandı.", date: "24 Ocak 2026", status: "completed" },
        { id: 5, title: "Evrak Toplama", desc: "Gerekli belgeler yükleniyor.", date: "Bugün", status: "current" },
        { id: 6, title: "Yeminli Tercüme", desc: "Belgelerin tercümesi yapılacak.", status: "pending" },
        { id: 7, title: "Üniversite Başvurusu", desc: "Resmi başvuru süreci.", status: "locked" },
        { id: 8, title: "Kabul Mektubu", desc: "Üniversiteden cevap bekleniyor.", status: "locked" },
        { id: 9, title: "Vize İşlemleri", desc: "Vize randevusu ve evrakları.", status: "locked" },
        { id: 10, title: "Uçuş ve Konaklama", desc: "Yeni hayatına merhaba de!", status: "locked" },
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
                                {step.date && (
                                    <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border ml-2 whitespace-nowrap">
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
