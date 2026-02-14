import { cn } from "@/lib/utils";
import { Check, Lock, Circle } from "lucide-react";

export function TimelineWidget() {
    const steps = [
        { id: 1, title: "Kayıt", status: "completed" },
        { id: 2, title: "Program", status: "completed" },
        { id: 3, title: "Sözleşme", status: "completed" },
        { id: 4, title: "Evrak", status: "current" },
        { id: 5, title: "Ödeme", status: "locked" },
        { id: 6, title: "Vize", status: "locked" },
    ];

    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-6">Süreç Takibi</h3>
            <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-border -z-10" />

                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-card px-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                            step.status === "completed" && "bg-green-500 border-green-500 text-white",
                            step.status === "current" && "bg-card border-primary text-primary animate-pulse",
                            step.status === "locked" && "bg-muted/30 border-muted text-muted-foreground/50"
                        )}>
                            {step.status === "completed" ? <Check className="w-4 h-4" /> :
                                step.status === "locked" ? <Lock className="w-3 h-3" /> :
                                    <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className={cn(
                            "text-xs font-medium hidden md:block",
                            step.status === "current" ? "text-primary" : "text-muted-foreground"
                        )}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
