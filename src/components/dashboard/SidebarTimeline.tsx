"use client";

import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarTimeline({ currentStep = 1 }: { currentStep?: number }) {
    // Simplified steps for sidebar
    const steps = [
        { id: 1, title: "Program Seçimi" },
        { id: 2, title: "Evrak Toplama" },
        { id: 3, title: "Sözleşme" },
        { id: 4, title: "Tercüme" },
        { id: 5, title: "Başvuru" },
        { id: 6, title: "Kabul & Vize" },
        { id: 7, title: "Uçuş" },
    ];

    return (
        <div className="px-2 py-2">
            <h4 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Başvuru Süreci
            </h4>
            <div className="space-y-0 relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-sidebar-border" />

                {steps.map((step, index) => {
                    let status = "pending";
                    if (step.id < currentStep) status = "completed";
                    else if (step.id === currentStep) status = "current";
                    else status = "locked";

                    return (
                        <div key={step.id} className="relative flex items-center gap-3 py-1.5 group">
                            {/* Dot/Icon */}
                            <div className={cn(
                                "z-10 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                status === "completed" && "bg-green-500 border-green-500 text-white",
                                status === "current" && "bg-sidebar border-primary text-primary ring-2 ring-primary/20",
                                status === "locked" && "bg-sidebar border-sidebar-border text-muted-foreground/30"
                            )}>
                                {status === "completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
                                {status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                {status === "locked" && <Circle className="w-2.5 h-2.5" />}
                            </div>

                            {/* Text */}
                            <span className={cn(
                                "text-sm transition-colors duration-200",
                                status === "completed" && "text-muted-foreground line-through decoration-transparent group-hover:decoration-muted-foreground/50 group-hover:text-muted-foreground/80",
                                status === "current" && "font-medium text-primary",
                                status === "locked" && "text-muted-foreground/50"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
