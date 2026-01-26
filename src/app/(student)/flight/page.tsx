"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, Calendar, MapPin, Home, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function FlightPage() {

    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Yolculuk Başlıyor! ✈️</h1>
                <p className="text-gray-500">Tüm süreçler başarıyla tamamlandı. İşte uçuş ve konaklama detayların.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Flight Ticket */}
                <Card className="p-0 overflow-hidden border-0 shadow-lg ring-1 ring-gray-200">
                    <div className="bg-primary p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Plane className="h-6 w-6" />
                            <span className="font-bold text-lg">TK 1234</span>
                        </div>
                        <span className="font-mono bg-white/20 px-3 py-1 rounded">BOARDING PASS</span>
                    </div>
                    <div className="p-6 space-y-6 bg-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Kalkış</p>
                                <p className="text-2xl font-bold">IST</p>
                                <p className="text-sm text-gray-600">İstanbul</p>
                            </div>
                            <div className="flex-1 border-b-2 border-dashed border-gray-300 mx-4 relative top-1"></div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase">Varış</p>
                                <p className="text-2xl font-bold">MUC</p>
                                <p className="text-sm text-gray-600">Münih</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-xs text-gray-500 uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Tarih</p>
                                <p className="font-semibold">15 Eylül 2026</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Saat</p>
                                <p className="font-semibold">14:30</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Accommodation */}
                <Card className="p-6 space-y-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Home className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Konaklama Bilgisi</h3>
                            <p className="text-sm text-gray-500">Student Dormitory A</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600">
                                Arcisstraße 21, 80333 München, Germany
                                <br />
                                <span className="text-xs text-gray-400">Kampüse 5 dk yürüme mesafesinde</span>
                            </p>
                        </div>
                        <Button variant="outline" className="w-full">Yol Tarifi Al</Button>
                    </div>
                </Card>
            </div>

            <div className="text-center pt-8">
                <p className="text-green-600 font-medium mb-4">Harika bir eğitim yılı dileriz!</p>
                <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                    Panoya Dön
                </Button>
            </div>
        </div>
    );
}
