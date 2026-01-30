"use client";

import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { APPLICATION_STEPS } from "@/lib/constants";

export default function TimelinePage() {
    const { data: session } = useSession();
    // @ts-ignore
    const currentStep = session?.user?.onboardingStep || 1;

    // Map APPLICATION_STEPS to timeline format with dynamic status
    const steps = APPLICATION_STEPS.map((step) => {
        let status: "completed" | "current" | "pending" | "locked";

        if (step.id < currentStep) {
            status = "completed";
        } else if (step.id === currentStep) {
            status = "current";
        } else if (step.id === currentStep + 1) {
            status = "pending";
        } else {
            status = "locked";
        }

        return {
            id: step.id,
            title: step.label,
            desc: step.description,
            status,
        };
    });

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Başvuru Süreci</h1>
            <p className="text-gray-500 mb-8">Eğitim yolculuğunun tüm adımlarını buradan takip edebilirsin.</p>

            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                        {/* Line & Icon */}
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-white",
                                step.status === "completed" && "bg-green-600 border-green-600 text-white",
                                step.status === "current" && "border-primary text-primary animate-pulse",
                                step.status === "pending" && "border-yellow-400 text-yellow-500",
                                step.status === "locked" && "border-gray-200 text-gray-300"
                            )}>
                                {step.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> :
                                    step.status === "current" ? <Clock className="w-6 h-6" /> :
                                        step.status === "locked" ? <Lock className="w-5 h-5" /> :
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
                            step.status === "current" && "border-primary/50 bg-orange-50 shadow-md",
                            step.status === "completed" && "border-green-100 bg-green-50/50",
                            step.status === "locked" && "opacity-50"
                        )}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={cn(
                                        "font-bold text-lg",
                                        step.status === "completed" ? "text-green-700" :
                                            step.status === "current" ? "text-primary" : "text-gray-900"
                                    )}>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                                </div>
                                {step.status === "current" && (
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                        Aktif
                                    </span>
                                )}
                                {step.status === "completed" && (
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                                        Tamamlandı
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
