"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { FileText, Download, Check } from "lucide-react";

export function ContractViewer() {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Danışmanlık Sözleşmesi</h1>
                    <p className="text-gray-500">Lütfen sözleşmeyi dikkatlice okuyup onaylayınız.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    PDF İndir
                </Button>
            </div>

            <Card className="p-0 overflow-hidden border-2">
                <ScrollArea className="h-[500px] w-full bg-gray-50 p-8 text-sm leading-relaxed text-gray-700">
                    <div className="max-w-2xl mx-auto bg-white p-10 shadow-sm min-h-[800px]">
                        <h2 className="text-center font-bold text-xl mb-8 border-b pb-4">ÖĞRENCİ DANIŞMANLIK HİZMET SÖZLEŞMESİ</h2>

                        <h3 className="font-bold mb-2">1. TARAFLAR</h3>
                        <p className="mb-4">İşbu sözleşme, bir tarafta StudentPortal Danışmanlık A.Ş. (bundan böyle "Danışman" olarak anılacaktır) ile diğer tarafta hizmet alacak öğrenci (bundan böyle "Öğrenci" olarak anılacaktır) arasında akdedilmiştir.</p>

                        <h3 className="font-bold mb-2">2. KONU</h3>
                        <p className="mb-4">İşbu sözleşmenin konusu, Öğrenci'nin yurtdışındaki üniversitelere başvurusu, kabul süreci ve vize işlemleri konusunda Danışman tarafından verilecek hizmetlerin kapsamının belirlenmesidir.</p>

                        <h3 className="font-bold mb-2">3. HİZMET KAPSAMI</h3>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Üniversite ve bölüm seçimi danışmanlığı</li>
                            <li>Başvuru belgelerinin kontrolü ve düzenlenmesi</li>
                            <li>Üniversite başvurularının yapılması</li>
                            <li>Kabul mektubu takibi</li>
                            <li>Vize danışmanlığı</li>
                        </ul>

                        <h3 className="font-bold mb-2">4. ÜCRETLENDİRME</h3>
                        <p className="mb-4">Hizmet bedeli ve ödeme takvimi Ek-1'de belirtilmiştir. Ödemeler banka havalesi veya kredi kartı ile yapılabilir.</p>

                        <div className="mt-12 pt-8 border-t flex justify-between">
                            <div>
                                <p className="font-bold">Danışman Firma</p>
                                <p className="text-gray-400">İmza / Kaşe</p>
                            </div>
                            <div>
                                <p className="font-bold">Öğrenci</p>
                                <p className="text-gray-400">İmza</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={accepted} onCheckedChange={(c) => setAccepted(c as boolean)} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Sözleşmeyi okudum, anladım ve kabul ediyorum.
                    </label>
                </div>
                <Button disabled={!accepted} className="w-full sm:w-auto bg-primary">
                    <Check className="mr-2 h-4 w-4" />
                    Sözleşmeyi Onayla
                </Button>
            </div>
        </div>
    );
}
