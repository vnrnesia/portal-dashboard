"use client";

import { useSession } from "next-auth/react";
import { DetailedTimeline } from "@/components/dashboard/DetailedTimeline";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Bell, ArrowRight, Star, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocumentReviewStatus } from "@/actions/documents";
import { getNotifications } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean | null;
    createdAt: Date | null;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const user = session?.user;
    // @ts-ignore
    const currentStep = user?.onboardingStep || 1;
    const [mounted, setMounted] = useState(false);
    const [isInReview, setIsInReview] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setMounted(true);
        // Fetch notifications
        getNotifications(4).then(setNotifications);
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
                    <div className={`p-8 rounded-2xl text-white shadow-xl relative overflow-hidden ${currentStep > 8 || (currentStep === 8 && isApproved)
                        ? "bg-gradient-to-br from-green-500 to-green-700"
                        : currentStep === 8
                            ? "bg-gradient-to-br from-cyan-600 to-blue-600"
                            : currentStep === 6
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
                                {currentStep > 8 || (currentStep === 8 && isApproved) ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                        <span className="font-medium">Tamamlandı</span>
                                    </>
                                ) : currentStep === 8 ? (
                                    <>
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="font-medium">Planlanıyor</span>
                                    </>
                                ) : currentStep === 6 ? (
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
                                <p className={`text-lg max-w-lg ${currentStep >= 8 ? "text-white/90" : currentStep === 6 ? "text-blue-100" : isApproved ? "text-green-100" : isInReview ? "text-yellow-100" : "text-orange-100"}`}>
                                    {(() => {
                                        if (currentStep > 8 || (currentStep === 8 && isApproved)) return "Tebrikler! Tüm başvuru sürecinizi tamamladınız.";
                                        if (currentStep === 8) return "Uçuş ve karşılama detaylarınız danışmanlarımız tarafından planlanıyor. Biletiniz yüklendiğinde size bilgi verilecektir.";
                                        if (currentStep === 6) return "Evraklarınızı üniversiteye ilettik, bu işlem 15 güne kadar sürebilir. Davetiyeniz yüklendiğinde sizinle iletişime geçilecektir.";
                                        if (isApproved) return "Bu aşamayı başarıyla tamamladınız. Bir sonraki adıma geçebilirsiniz.";

                                        switch (currentStep) {
                                            case 1: return "Profil bilgilerinizi şimdi doldurun veya sonraki adımlarda doldurabilirsiniz. Bir program seçerek serüveninize devam ediniz.";
                                            case 2: return "Hedeflediğiniz üniversite ve bölümleri buradan seçebilirsiniz.";
                                            case 3: return isInReview ? "Belgeleriniz inceleniyor. Onaylandığında bir sonraki aşamaya geçebileceksiniz." : "Başvuru için gerekli belgeleri eksiksiz yüklemelisiniz.";
                                            case 4: return isInReview ? "Sözleşmeniz kontrol ediliyor." : "Sürecin başlaması için hizmet sözleşmesini onaylamanız gerekmektedir.";
                                            case 5: return isInReview ? "Belgeleriniz tercüme ve kontrol aşamasında." : "Tercüme ettiğiniz belgeleri yüklemek için bu adımdan devam edin.";
                                            case 7: return "Kabul mektubunuz geldiğinde vize sürecine geçeceğiz.";
                                            default: return "Başvuru sürecini tamamlamak için bu adımı bitirmelisin.";
                                        }
                                    })()}
                                </p>
                            </div>
                            <div className="pt-2">
                                {currentStep >= 8 ? (
                                    // Final step reached — no more advancement
                                    <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold border-0 cursor-pointer text-blue-600">
                                        <Link href="/flight">
                                            Detayları Gör
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (isApproved && currentStep !== 6) ? (
                                    <Button
                                        size="lg"
                                        className="bg-white text-green-600 hover:bg-gray-100 font-bold border-0 cursor-pointer"
                                        onClick={async () => {
                                            try {
                                                const { advanceUserStep } = await import("@/actions/advance-step");
                                                await advanceUserStep(currentStep + 1);
                                                window.location.reload();
                                            } catch (error) {
                                                // Step advancement failed
                                            }
                                        }}
                                    >
                                        Sonraki Adıma Geç
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                ) : currentStep === 1 ? (
                                    // Step 1: Show two buttons — profile + programs
                                    <div className="flex flex-wrap gap-3">
                                        <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold border-0 cursor-pointer">
                                            <Link href="/programs">
                                                Devam Et
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="bg-white/20 text-white hover:bg-white/30 font-bold border-white/40 cursor-pointer backdrop-blur-sm">
                                            <Link href="/profile">
                                                Profil Bilgilerini Doldur
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <Button asChild size="lg" className={`font-bold border-0 cursor-pointer ${currentStep === 6
                                        ? "bg-white text-blue-600 hover:bg-gray-100"
                                        : "bg-white text-primary hover:bg-gray-100"
                                        }`}>
                                        <Link href={nextPath}>
                                            {currentStep === 6 ? "Durumu Gör"
                                                : isInReview ? "Durumu Gör"
                                                    : currentStep === 3 ? "Belge Yükle"
                                                        : currentStep === 4 ? "Sözleşmeyi İmzala"
                                                            : currentStep === 5 ? "Belgeleri Yükle"
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
                                <Link href="/notifications" className="text-xs text-primary hover:underline">
                                    Tümünü Gör
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {notifications.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        Henüz bildirim yok
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <Link
                                            key={notif.id}
                                            href="/notifications"
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className={`w-2 h-2 mt-2 rounded-full ${!notif.isRead ? 'bg-red-500' : 'bg-gray-300'}`} />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 font-medium">{notif.title}</p>
                                                <p className="text-xs text-gray-600 line-clamp-1">{notif.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notif.createdAt && formatDistanceToNow(
                                                        new Date(notif.createdAt),
                                                        { addSuffix: true, locale: tr }
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
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

