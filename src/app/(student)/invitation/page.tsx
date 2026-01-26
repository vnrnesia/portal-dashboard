"use client";

import { Button } from "@/components/ui/button";
import { useFunnelStore } from "@/lib/stores/useFunnelStore";
import { Download, PartyPopper, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function InvitationPage() {
    const { completeStep } = useFunnelStore();

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                        <PartyPopper className="h-10 w-10 text-green-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Tebrikler! Kabul Aldınız 🎉</h1>
                <p className="text-xl text-gray-600">Üniversiteniz başvurunuzu onayladı ve resmi davetiyenizi gönderdi.</p>
            </div>

            <Card className="p-8 bg-white border shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full opacity-50 -mr-16 -mt-16" />

                <div className="space-y-6 relative z-10">
                    <div className="text-left space-y-1 border-b pb-4">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Üniversite</p>
                        <p className="text-xl font-bold">Technical University of Munich</p>
                    </div>
                    <div className="text-left space-y-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Bölüm</p>
                        <p className="text-xl font-semibold">Computer Science (B.Sc.)</p>
                    </div>

                    <Button variant="outline" className="w-full h-14 text-lg border-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                        <Download className="mr-2 h-5 w-5" />
                        Resmi Kabul Mektubunu İndir (PDF)
                    </Button>
                </div>
            </Card>

            <div className="flex justify-center pt-8">
                <Button size="lg" onClick={() => completeStep()} className="w-full md:w-auto text-lg px-8 bg-primary hover:bg-primary/90">
                    Vize İşlemlerine Başla
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
