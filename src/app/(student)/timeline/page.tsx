"use client";

import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function TimelinePage() {
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
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Başvuru Süreci</h1>
            <p className="text-gray-500 mb-8">Eğitim yolculuğunun tüm adımlarını buradan takip edebilirsin.</p>

            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                        {/* Line & Icon */}
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white",
                                step.status === "completed" && "bg-green-600 border-green-600 text-white",
                                step.status === "current" && "border-primary text-primary animate-pulse",
                                (step.status === "pending" || step.status === "locked") && "border-gray-200 text-gray-300"
                            )}>
                                {step.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> :
                                    step.status === "current" ? <Clock className="w-6 h-6" /> :
                                        <Circle className="w-6 h-6" />}
                            </div>
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "w-0.5 h-16 md:h-24 -my-2",
                                    step.status === "completed" ? "bg-green-600" : "bg-gray-200"
                                )}></div>
                            )}
                        </div>

                        {/* Content */}
                        <Card className={cn(
                            "flex-1 mb-6 p-4 border transition-all",
                            step.status === "current" && "border-blue-300 bg-orange-50 shadow-md",
                            step.status === "locked" && "opacity-50"
                        )}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={cn("font-bold text-lg", step.status === "completed" ? "text-green-700" : "text-gray-900")}>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                                </div>
                                {step.date && (
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        {step.date}
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
