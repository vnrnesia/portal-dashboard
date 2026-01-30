"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadVisaReceipt } from "@/actions/visa-actions";
import { Truck, Upload, FileText } from "lucide-react";

interface VisaTrackingFormProps {
    initialCode?: string | null;
    initialReceipt?: {
        fileName: string;
        fileUrl: string;
    } | null;
}

export function VisaTrackingForm({ initialCode, initialReceipt }: VisaTrackingFormProps) {
    const [code, setCode] = useState(initialCode || "");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("code", code);
        if (file) {
            formData.append("file", file);
        }

        try {
            const result = await uploadVisaReceipt(formData);
            if (result.success) {
                toast.success(result.message);
                // Optional: Force refresh or state update could act here, 
                // but usually server action revalidatePath handles it.
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <Truck className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Kargo Takip ve Makbuzu</h4>
            </div>

            {initialCode ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Kaydedilen Takip Kodu:</p>
                        <div className="p-3 bg-gray-50 rounded-md font-mono text-lg font-medium tracking-wider border">
                            {initialCode}
                        </div>
                    </div>

                    {initialReceipt ? (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Yüklenen Makbuz:</p>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md border border-green-100">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="text-sm text-green-700 truncate flex-1">{initialReceipt.fileName}</span>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={initialReceipt.fileUrl} target="_blank" rel="noopener noreferrer">
                                        Gör
                                    </a>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Bilgiler güncellenemez. Bir hata varsa danışmanınızla iletişime geçin.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Kargo Makbuzu Yükleyiniz:
                                </p>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="cursor-pointer file:cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                {loading ? "Yükleniyor..." : "Makbuzu Yükle"}
                            </Button>
                        </form>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Takip Kodu:
                        </p>
                        <Input
                            placeholder="Kargo Takip Kodu Giriniz"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Kargo Makbuzu (Fotoğraf/PDF):
                        </p>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="cursor-pointer file:cursor-pointer"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        {loading ? "Kaydediliyor..." : "Kaydet ve Yükle"}
                    </Button>
                </form>
            )}
        </div>
    );
}
