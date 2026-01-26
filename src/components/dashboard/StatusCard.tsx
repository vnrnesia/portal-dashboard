import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export function StatusCard() {
    // Mock status - normally comes from store
    const status = "pending_documents";

    const statusConfig = {
        pending_documents: {
            label: "Evrak Bekleniyor",
            description: "Başvuru sürecini tamamlamak için lütfen eksik belgelerini yükle.",
            color: "bg-yellow-500",
            icon: Clock,
            variant: "warning" as const
        },
        approved: {
            label: "Onaylandı",
            description: "Başvurunuz onaylandı! Bir sonraki adımı bekleyin.",
            color: "bg-green-500",
            icon: CheckCircle2,
            variant: "success" as const
        }
    };

    const current = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_documents;

    return (
        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Mevcut Durum
                </CardTitle>
                <current.icon className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-1">{current.label}</div>
                <p className="text-xs text-muted-foreground">
                    {current.description}
                </p>
            </CardContent>
        </Card>
    );
}
