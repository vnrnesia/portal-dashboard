"use client";

import { useSession } from "next-auth/react";
import { DetailedTimeline } from "@/components/dashboard/DetailedTimeline";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Bell, ArrowRight, Star, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocumentReviewStatus } from "@/actions/documents";

export default function DashboardPage() {
    const { data: session } = useSession();
    const user = session?.user;
    // @ts-ignore
    const currentStep = user?.onboardingStep || 1;
    const [mounted, setMounted] = useState(false);
    const [isInReview, setIsInReview] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch document review status for steps that have documents (2, 3, 4)
    useEffect(() => {
        if (currentStep >= 2) {
            getDocumentReviewStatus(currentStep).then(result => {
                setIsInReview(result.hasDocumentsInReview);
                setIsApproved(result.stepApprovalStatus === "approved");
            });
        }
    }, [currentStep]);

    // Step labels mapping aligned with APPLICATION_STEPS
    const stepLabels: Record<number, string> = {
        1: "Kayıt İşlemleri",
        2: "Program Seçimi",
        3: "Evrak Yükleme",
        4: "Sözleşme Onayı",
        5: "Belgelerin Tercümelenmesi",
        6: "Üniversite Başvurusu",
        7: "Kabul ve Vize Süreci",
        8: "Uçuş ve Karşılama"
    };

    const nextStepLabels: Record<number, string> = {
        1: "/programs", // Go to Programs to start Step 2
        2: "/programs", // Determine programs
        3: "/documents",
        4: "/contract",
        5: "/translation",
        6: "/application-status",
        7: "/acceptance",
        8: "/flight",
    };

    const currentLabel = stepLabels[currentStep] || "Tamamlandı";
    const nextPath = nextStepLabels[currentStep] || "/dashboard";

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
                    Mevcut Aşama: <strong>{currentLabel}</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="md:col-span-2 space-y-6">

                    {/* CTA Card for Next Step */}
                    <div className={`p-8 rounded-2xl text-white shadow-xl relative overflow-hidden ${currentStep === 5
                        ? "bg-gradient-to-br from-blue-500 to-blue-700"
                        : isApproved
                            ? "bg-gradient-to-br from-green-500 to-green-700"
                            : isInReview
                                ? "bg-gradient-to-br from-yellow-500 to-yellow-700"
                                : "bg-gradient-to-br from-primary to-orange-700"
                        }`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none" />

                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm backdrop-blur-sm">
                                {currentStep === 5 ? (
                                    <>
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="font-medium">Beklemede</span>
                                    </>
                                ) : isApproved ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                        <span className="font-medium">Tamamlandı</span>
                                    </>
                                ) : isInReview ? (
                                    <>
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="font-medium">İnceleniyor</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                        <span className="font-medium">Sıradaki Adım</span>
                                    </>
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{currentLabel}</h2>
                                <p className={`text-lg max-w-lg ${currentStep === 5 ? "text-blue-100" : isApproved ? "text-green-100" : "text-orange-100"}`}>
                                    {(() => {
                                        if (isApproved) return "Bu aşamayı başarıyla tamamladınız. Bir sonraki adıma geçebilirsiniz.";

                                        switch (currentStep) {
                                            case 1: return "Profilinizi tamamladınız. Şimdi size uygun programları seçelim.";
                                            case 2: return "Hedeflediğiniz üniversite ve bölümleri buradan seçebilirsiniz.";
                                            case 3: return isInReview ? "Belgeleriniz inceleniyor. Onaylandığında bir sonraki aşamaya geçebileceksiniz." : "Başvuru için gerekli belgeleri eksiksiz yüklemelisiniz.";
                                            case 4: return isInReview ? "Sözleşmeniz kontrol ediliyor." : "Sürecin başlaması için hizmet sözleşmesini onaylamanız gerekmektedir.";
                                            case 5: return isInReview ? "Belgeleriniz tercüme ve kontrol aşamasında." : "Tercüme ettiğiniz belgeleri yüklemek için bu adımdan devam edin.";
                                            case 6: return "Üniversite başvurularınız yapılıyor. Sonuçlar bekleniyor.";
                                            case 7: return "Kabul mektubunuz geldiğinde vize sürecine geçeceğiz.";
                                            case 8: return isApproved ? "Uçuş bilgileriniz ve biletiniz hazır. İyi yolculuklar!" : "Uçuş ve karşılama detaylarınız şu anda planlanıyor.";
                                            default: return "Başvuru sürecini tamamlamak için bu adımı bitirmelisin.";
                                        }
                                    })()}
                                </p>
                            </div>
                            <div className="pt-2">
                                {isApproved ? (
                                    <Button
                                        size="lg"
                                        className="bg-white text-green-600 hover:bg-gray-100 font-bold border-0 cursor-pointer"
                                        onClick={async () => {
                                            const { advanceUserStep } = await import("@/actions/advance-step");
                                            await advanceUserStep(currentStep + 1);
                                            window.location.reload(); // Force refresh to update session/UI
                                        }}
                                    >
                                        Sonraki Adıma Geç
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                ) : (
                                    <Button asChild size="lg" className={`font-bold border-0 cursor-pointer ${currentStep === 5
                                        ? "bg-white text-blue-600 hover:bg-gray-100"
                                        : "bg-white text-primary hover:bg-gray-100"
                                        }`}>
                                        <Link href={nextPath}>
                                            {currentStep === 5 ? "Belgeleri Yükle"
                                                : isInReview ? "Durumu Gör"
                                                    : currentStep === 3 ? "Belge Yükle"
                                                        : currentStep === 4 ? "Sözleşmeyi İmzala"
                                                            : currentStep === 8 ? "Detayları Gör"
                                                                : "Devam Et"}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications + Quick Actions side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* Quick Actions */}
                        <QuickActions />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <DetailedTimeline currentStep={currentStep} />
                </div>
            </div>
        </div>
    );
}

