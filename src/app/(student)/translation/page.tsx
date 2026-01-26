"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFunnelStore } from "@/lib/stores/useFunnelStore";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function TranslationPage() {
    const { completeStep } = useFunnelStore();

    const handleComplete = () => {
        toast.success("Tercüme talebiniz alındı. Uzmanlarımız belgelerinizi inceleyecek.");
        completeStep();
        // In a real app, router.push next step
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tercüme İşlemleri</h1>
                <p className="text-gray-500">Üniversite başvurusu için gerekli belgelerin yeminli tercümesi gerekmektedir.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-dashed border-2 flex flex-col items-center justify-center space-y-4 min-h-[200px] bg-gray-50">
                    <div className="p-4 bg-orange-100 rounded-full">
                        <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold">Ek Belge Yükle</h3>
                        <p className="text-sm text-gray-500">Varsa ek transkript veya sertifikalarınızı yükleyin.</p>
                    </div>
                    <Button variant="outline">Dosya Seç</Button>
                </Card>

                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Otomatik Çevrilenler
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Lise Diploması (İşlemde)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Pasaport Kimlik Sayfası (Tamamlandı)
                        </li>
                    </ul>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleComplete} className="bg-primary hover:bg-primary/90">
                    Tercüme Onayı Ver ve Devam Et
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
