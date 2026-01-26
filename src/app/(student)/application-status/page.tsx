"use client";

import { Button } from "@/components/ui/button";
import { useFunnelStore } from "@/lib/stores/useFunnelStore";
import { CheckCircle2, Loader2, ArrowRight, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ApplicationStatusPage() {
    const { completeStep } = useFunnelStore();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Başvuru Durumu</h1>
                <p className="text-gray-500">Başvurunuz üniversiteye iletildi. Üniversiteden yanıt bekleniyor.</p>
            </div>

            <Card className="p-8 flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
                    <div className="relative bg-white p-4 rounded-full border-2 border-blue-100 shadow-sm">
                        <Building2 className="h-12 w-12 text-blue-600" />
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="h-5 w-5" />
                            Belgeler İletildi
                        </span>
                        <span className="text-sm">26 Ocak 14:00</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                        <span className="flex items-center gap-2 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Üniversite Değerlendirmesi
                        </span>
                        <span className="text-sm">İşlemde</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 text-gray-400 rounded-lg border border-gray-200">
                        <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="h-5 w-5" />
                            Kabul & Davetiye
                        </span>
                        <span className="text-sm">Bekleniyor</span>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end pt-4">
                {/* Mocking the 'Success' state for demo flow */}
                <Button size="lg" onClick={() => completeStep()} className="bg-primary hover:bg-primary/90">
                    (Demo) Üniversiteden Kabul Geldi Say
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
