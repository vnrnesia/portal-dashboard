import { getDocuments } from "@/actions/documents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Plane, ExternalLink, CalendarDays } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { VisaTrackingForm } from "@/components/visa/VisaTrackingForm";

export default async function AcceptancePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const [docs, user] = await Promise.all([
        getDocuments(),
        db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        })
    ]);

    const invitationLetter = docs.find(doc => doc.type === "invitation_letter");

    if (!invitationLetter) {
        redirect("/application-status");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kabul ve Vize İşlemleri</h1>
                    <p className="text-gray-500 mt-2">Tebrikler! Kabul mektubunuz ulaştı. Şimdi sırada vize işlemleri var.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/application-status">
                            Başvuru Durumu
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Acceptance Letter */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-800 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Kabul Mektubu
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Üniversiteden gelen resmi davet mektubunuz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-10 w-10 text-green-600" />
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate">{invitationLetter.fileName}</p>
                                        <p className="text-xs text-gray-500">PDF Belgesi</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                                    <a href={invitationLetter.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                                        Mektubu İndir
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Önemli Hatırlatma</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Vize görüşmesine giderken kabul mektubunuzun <strong>renkli çıktısını</strong> yanınızda bulundurmayı unutmayın. Ayrıca pasaport sürenizin en az 1 yıl geçerli olduğundan emin olun.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Visa Steps */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vize Başvuru Süreci</CardTitle>
                            <CardDescription>Vize ve pasaport işlemleriniz danışmanınız tarafından yürütülecektir.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-none p-2 bg-blue-100 rounded-lg h-fit">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">1. Pasaport ve Evrak Gönderimi</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Vize işlemlerinizin başlatılması için pasaportunuzu ve gerekli evrakları danışmanınızın size ileteceği adrese kargolamanız gerekmektedir.
                                    </p>
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-900 font-medium">
                                        Halıdere Yalı Mah. No: 4, Gölcük, Kocaeli
                                    </div>
                                    <div className="mt-4">
                                        <VisaTrackingForm
                                            initialCode={user?.visaTrackingCode}
                                            initialReceipt={docs.find(doc => doc.type === "visa_receipt") ? {
                                                fileName: docs.find(doc => doc.type === "visa_receipt")?.fileName || "Makbuz",
                                                fileUrl: docs.find(doc => doc.type === "visa_receipt")?.fileUrl || "#"
                                            } : null}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-none p-2 bg-orange-100 rounded-lg h-fit">
                                    <CalendarDays className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">2. Vize İşlem Süreci</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Vize başvurunuz danışmanınız tarafından yapılacaktır. Bu süreç konsolosluk yoğunluğuna bağlı olarak ortalama <strong>7 gün</strong> sürebilir.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-none p-2 bg-purple-100 rounded-lg h-fit">
                                    <Plane className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">3. Teslimat</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        İşlemler tamamlandıktan sonra pasaportunuz kargo ile size geri gönderilecektir. Kargo süreci konumuza bağlı olarak yaklaşık <strong>3 gün</strong> sürebilir.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
