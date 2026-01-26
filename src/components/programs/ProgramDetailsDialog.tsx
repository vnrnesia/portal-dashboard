"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Program } from "@/lib/data/programs";
import { Users, Globe, Wallet, Trophy, CheckCircle2, MapPin } from "lucide-react";

interface ProgramDetailsDialogProps {
    program: Program | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function ProgramDetailsDialog({ program, open, onOpenChange, onConfirm }: ProgramDetailsDialogProps) {
    if (!program) return null;

    // Fallback defaults if details are missing
    const details = program.details || {
        studentCount: "N/A",
        internationalStudents: "N/A",
        livingCost: "N/A",
        ranking: "N/A",
        locationStats: "Kampüs",
        description: "Bu üniversite hakkında detaylı bilgi için danışmanınızla görüşebilirsiniz."
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-500">
                            {program.logo}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">{program.university}</DialogTitle>
                            <DialogDescription className="text-base font-medium text-gray-700 mt-1">
                                {program.name}
                            </DialogDescription>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <MapPin className="h-3 w-3" />
                                {program.city}, {program.country}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 space-y-2">
                            <div className="flex items-center gap-2 text-orange-700 text-sm font-semibold">
                                <Users className="h-4 w-4" />
                                Öğrenci Sayısı
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{details.studentCount}</p>
                            <p className="text-xs text-gray-500">{details.internationalStudents} Uluslararası</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-2">
                            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                                <Wallet className="h-4 w-4" />
                                Yaşam Maliyeti
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{details.livingCost}</p>
                            <p className="text-xs text-gray-500">Ortalama Aylık Gider</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
                            <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
                                <Trophy className="h-4 w-4" />
                                Dünya Sıralaması
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{details.ranking}</p>
                            <p className="text-xs text-gray-500">Global Başarı</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-2">
                            <div className="flex items-center gap-2 text-purple-700 text-sm font-semibold">
                                <Globe className="h-4 w-4" />
                                Lokasyon
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{details.locationStats}</p>
                            <p className="text-xs text-gray-500">Şehir Özelliği</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Üniversite Hakkında</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {details.description}
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Vazgeç
                    </Button>
                    <Button onClick={onConfirm} className="bg-primary hover:bg-primary/90">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Bu Programı Seç
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
