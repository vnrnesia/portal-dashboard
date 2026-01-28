"use client";

import { CheckCircle2, Loader2, Building2, Clock, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function ApplicationStatusPage() {
    const [submissionDate, setSubmissionDate] = useState<string>("");

    useEffect(() => {
        // Set the current date when the page loads
        const now = new Date();
        const formattedDate = now.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
        setSubmissionDate(formattedDate);
    }, []);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Başvuru Durumu</h1>
                <p className="text-gray-500">Başvurunuz üniversiteye iletildi. Üniversiteden yanıt bekleniyor.</p>
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-800">Evraklarınız İletildi</h4>
                        <p className="text-sm text-blue-700">
                            Evraklarınızı üniversiteye ilettik, üniversiteden dönüş bekleniyor.
                            Bu işlem <strong>15 güne kadar</strong> sürebilir. Kabul durumunuz hakkında
                            size bildirim göndereceğiz.
                        </p>
                    </div>
                </div>
            </Card>

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
                        <span className="text-sm">{submissionDate || "Yükleniyor..."}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                        <span className="flex items-center gap-2 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Üniversite Değerlendirmesi
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>15 güne kadar</span>
                        </div>
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
        </div>
    );
}

