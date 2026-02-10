"use client";

import { CheckCircle2, Loader2, Building2, Clock, Info, FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
// import Link from "next/link"; // Link is no longer needed for the button part if we use router.push, but maybe used elsewhere?
// checking if Link is used elsewhere... no, it was only for that button. Removing it.
import { useRouter } from "next/navigation";

interface ApplicationStatusClientProps {
    invitationLetter?: {
        fileName: string;
        fileUrl: string;
    } | null;
    currentStep: number;
}

export default function ApplicationStatusClient({ invitationLetter, currentStep }: ApplicationStatusClientProps) {
    const [submissionDate, setSubmissionDate] = useState<string>("");
    const router = useRouter();

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
                <p className="text-gray-500">
                    {invitationLetter
                        ? "Tebrikler! Üniversiteden kabul mektubunuz geldi."
                        : "Başvurunuz üniversiteye iletildi. Üniversiteden yanıt bekleniyor."
                    }
                </p>
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-800">
                            {invitationLetter ? "Kabul Mektubunuz Hazır!" : "Evraklarınız İletildi"}
                        </h4>
                        <p className="text-sm text-blue-700">
                            {invitationLetter
                                ? "Üniversiteden gelen davet mektubunu aşağıdan görüntüleyebilir ve bir sonraki adıma geçebilirsiniz."
                                : "Evraklarınızı üniversiteye ilettik, üniversiteden dönüş bekleniyor. Bu işlem 15 güne kadar sürebilir. Kabul durumunuz hakkında size bildirim göndereceğiz."
                            }
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-8 flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${invitationLetter ? "bg-green-100" : "bg-blue-100"}`} />
                    <div className={`relative p-4 rounded-full border-2 shadow-sm ${invitationLetter ? "bg-white border-green-100" : "bg-white border-blue-100"}`}>
                        <Building2 className={`h-12 w-12 ${invitationLetter ? "text-green-600" : "text-blue-600"}`} />
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

                    <div className={`flex items-center justify-between p-4 rounded-lg border ${invitationLetter
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        <span className="flex items-center gap-2 font-medium">
                            {invitationLetter ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                            Üniversite Değerlendirmesi
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            {invitationLetter ? (
                                <span>Tamamlandı</span>
                            ) : (
                                <>
                                    <Clock className="h-4 w-4" />
                                    <span>15 güne kadar</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={`flex flex-col p-4 rounded-lg border ${invitationLetter
                        ? "bg-white border-green-200 shadow-sm"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                        }`}>
                        <div className="flex items-center justify-between w-full">
                            <span className={`flex items-center gap-2 font-medium ${invitationLetter ? "text-green-700" : ""}`}>
                                {invitationLetter ? <CheckCircle2 className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                Kabul & Davetiye
                            </span>
                            <span className="text-sm">{invitationLetter ? "Hazır" : "Bekleniyor"}</span>
                        </div>

                        {invitationLetter && (
                            <div className="mt-4 pt-4 border-t w-full flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-3 flex-1 w-full bg-gray-50 p-3 rounded-lg border">
                                    <FileText className="h-8 w-8 text-red-500" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate text-gray-900">{invitationLetter.fileName}</p>
                                        <p className="text-xs text-gray-500">Davet Mektubu</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={invitationLetter.fileUrl} target="_blank" rel="noopener noreferrer">
                                            Görüntüle
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {invitationLetter && currentStep < 8 && (
                        <div className="pt-4 flex justify-end">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                    try {
                                        const { advanceUserStep } = await import("@/actions/advance-step");
                                        await advanceUserStep(currentStep + 1);
                                        window.location.reload();
                                    } catch (error) {
                                        // Step advancement failed — already at max or invalid
                                    }
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    Kabul & Vize Adımına Geç
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
