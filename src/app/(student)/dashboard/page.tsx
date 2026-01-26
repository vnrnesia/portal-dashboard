"use client";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useFunnelStore, FUNNEL_STEPS, FunnelStep } from "@/lib/stores/useFunnelStore";
import { DetailedTimeline } from "@/components/dashboard/DetailedTimeline";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Bell, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { currentStep } = useFunnelStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Find current step details
    const stepDetails = FUNNEL_STEPS.find(s => s.id === currentStep) || FUNNEL_STEPS[1];
    const nextStep = FUNNEL_STEPS.find(s => s.id === currentStep + 1);

    const mockNotifications = [
        { id: 1, text: "Evraklarınız incelenmeye alındı.", time: "2 saat önce", unread: true },
        { id: 2, text: "Yeni program önerileri eklendi.", time: "1 gün önce", unread: false },
    ];

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Genel Bakış</h1>
                    <p className="text-gray-500">Hoş geldin, <span className="font-semibold text-primary">{user?.name}</span>. Eğitim yolculuğunda bugünkü durumun:</p>
                </div>
                <div className="hidden md:block text-sm text-gray-500 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                    Mevcut Aşama: <strong>{stepDetails.label}</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="md:col-span-2 space-y-6">

                    {/* CTA Card for Next Step */}
                    <div className="bg-gradient-to-br from-primary to-orange-700 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none" />

                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm backdrop-blur-sm">
                                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                <span className="font-medium">Sıradaki Adım</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{stepDetails.id === FunnelStep.FLIGHT_TICKET ? "Yolculuk Hazır!" : stepDetails.label}</h2>
                                <p className="text-orange-100 text-lg max-w-lg">
                                    {stepDetails.id === FunnelStep.FLIGHT_TICKET
                                        ? "Tüm işlemler tamamlandı. Uçuş bilgilerinizi kontrol edin."
                                        : "Başvuru sürecini tamamlamak için bu adımı bitirmelisin."}
                                </p>
                            </div>
                            <div className="pt-2">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold border-0 cursor-pointer">
                                    <Link href={stepDetails.path}>
                                        {stepDetails.id === FunnelStep.FLIGHT_TICKET ? "Biletini Gör" : "Devam Et"}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Son Bildirimler
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {mockNotifications.map((notif) => (
                                <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${notif.unread ? 'bg-red-500' : 'bg-gray-300'}`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{notif.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <DetailedTimeline />
                </div>
            </div>

            {/* Bottom Section - Moved Quick Actions Here */}
            <div>
                <QuickActions />
            </div>
        </div>
    );
}
