import { Button } from "@/components/ui/button";
import { Upload, Search, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    const actions = [
        {
            label: "Belge Yükle",
            icon: Upload,
            href: "/documents",
            variant: "default" as const,
            color: "bg-primary hover:bg-primary/90"
        },
        {
            label: "Program Ara",
            icon: Search,
            href: "/programs",
            variant: "outline" as const,
            color: "border-blue-200 hover:bg-blue-50 text-primary/90"
        },
        {
            label: "Destek Al",
            icon: MessageSquare,
            href: "/messages",
            variant: "outline" as const,
            color: "border-green-200 hover:bg-green-50 text-green-700"
        },
        {
            label: "Sözleşmem",
            icon: FileText,
            href: "/contract",
            variant: "ghost" as const,
            color: "hover:bg-gray-100"
        }
    ];

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
            <h3 className="font-semibold mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <Link key={index} href={action.href} className="w-full">
                        <Button
                            variant={action.variant}
                            className={`w-full h-auto py-4 flex flex-col gap-2 ${action.color}`}
                        >
                            <action.icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{action.label}</span>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
