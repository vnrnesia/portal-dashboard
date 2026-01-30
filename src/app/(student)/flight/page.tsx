
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, Calendar, MapPin, Home, Clock, Info } from "lucide-react";
import FlightClient from "./FlightClient";
import { auth } from "@/auth";
import { getDocuments } from "@/actions/documents";
import { requireStep } from "@/lib/step-protection";

export default async function FlightPage() {
    // Require Step 7 (Acceptance) or 8 (Flight)
    // Actually, Flight is step 8.
    await requireStep(8);

    const session = await auth();
    const docs = await getDocuments();

    const flightTicket = docs.find(d => d.type === "flight_ticket" && d.status === "approved");

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Uçuş ve Karşılama ✈️</h1>
                <p className="text-gray-500">
                    {flightTicket
                        ? "Uçuş detaylarınız hazır! İyi yolculuklar dileriz."
                        : "Uçuş ve karşılama detaylarınız danışmanlarımız tarafından ayarlanıyor."}
                </p>
            </div>

            {flightTicket ? (
                // Show Flight Details if ticket exists
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Flight Ticket */}
                    <Card className="p-0 overflow-hidden border-0 shadow-lg ring-1 ring-gray-200">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Plane className="h-6 w-6" />
                                <span className="font-bold text-lg">Uçuş Detayı</span>
                            </div>
                            <span className="font-mono bg-white/20 px-3 py-1 rounded">BİLET</span>
                        </div>
                        <div className="p-6 space-y-6 bg-white">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-900">Dosya Adı</p>
                                    <p className="text-xs text-gray-500">{flightTicket.fileName}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={flightTicket.fileUrl || "#"} target="_blank" rel="noopener noreferrer">Bileti İndir</a>
                                </Button>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded border border-yellow-100 text-sm text-yellow-800">
                                <Info className="h-4 w-4 inline-block mr-1 mb-0.5" />
                                Lütfen uçuş saatinizden en az 3 saat önce havalimanında olunuz.
                            </div>
                        </div>
                    </Card>

                    {/* Accommodation Hint */}
                    <Card className="p-6 space-y-4 flex flex-col justify-center bg-gray-50 border-dashed">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Home className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Karşılama & Konaklama</h3>
                                <p className="text-sm text-gray-500">Detaylar ayrıca iletilecektir.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                // Show "Pending" state
                <Card className="p-12 text-center space-y-6 border-blue-100 bg-blue-50/50">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                        <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-blue-900">Planlama Yapılıyor</h3>
                        <p className="text-blue-700 max-w-md mx-auto mt-2">
                            Danışmanlarımız şu anda uçuş ve karşılama detaylarınızı organize ediyor.
                            Biletiniz hazır olduğunda buradan görüntüleyebileceksiniz ve size bildirim gönderilecektir.
                        </p>
                    </div>
                </Card>
            )}

            <FlightClient />
        </div>
    );
}
