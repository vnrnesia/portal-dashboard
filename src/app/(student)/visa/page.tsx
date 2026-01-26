"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useFunnelStore } from "@/lib/stores/useFunnelStore";
import { Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function VisaPage() {
    const { completeStep } = useFunnelStore();
    const [address, setAddress] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            toast.error("Lütfen teslimat adresini giriniz.");
            return;
        }
        toast.success("Adresiniz kaydedildi. Pasaport kurye için hazır.");
        completeStep();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Vize & Kargo</h1>
                <p className="text-gray-500">Vize işlemleri için pasaportunuzun ofisimize iletilmesi veya işlem sonrası size kargolanması için adres bilgisi gereklidir.</p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-orange-50 text-orange-800 rounded-lg">
                        <Truck className="h-6 w-6 mt-1" />
                        <div>
                            <h4 className="font-semibold">Kargo Bilgilendirmesi</h4>
                            <p className="text-sm">Pasaportunuz vize işlemi tamamlandıktan sonra güvenli kurye ile belirttiğiniz adrese teslim edilecektir.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Teslimat Adresi</Label>
                        <Textarea
                            id="address"
                            placeholder="Mahalle, Sokak, No, İlçe/İl..."
                            className="min-h-[100px]"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">İletişim Telefonu</Label>
                            <Input id="phone" placeholder="0555..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Posta Kodu</Label>
                            <Input id="code" placeholder="34000" />
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                        Adresi Kaydet ve İlerle
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </Card>
        </div>
    );
}
