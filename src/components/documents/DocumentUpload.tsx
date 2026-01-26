"use client";

import { useDocStore, Document } from "@/lib/stores/useDocStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, Clock, Eye, Send, FileText, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useFunnelStore, FunnelStep } from "@/lib/stores/useFunnelStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function DocumentItem({ doc, onPreview }: { doc: Document, onPreview: (doc: Document) => void }) {
    const { updateStatus, removeDocument } = useDocStore();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            updateStatus(doc.id, 'uploaded', file.name, url);
            toast.success(`${doc.label} başarıyla yüklendi: ${file.name}`);
        }
    }, [doc.id, doc.label, updateStatus]);

    const onDelete = () => {
        removeDocument(doc.id);
        toast.info(`${doc.label} silindi.`);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png'] },
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: doc.status === 'approved' || doc.status === 'reviewing'
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-500">Onaylandı</Badge>;
            case 'reviewing': return <Badge className="bg-yellow-500">İnceleniyor</Badge>;
            case 'uploaded': return <Badge className="bg-primary">Yüklendi</Badge>;
            case 'rejected': return <Badge className="bg-red-500">Reddedildi</Badge>;
            default: return <Badge variant="secondary">Bekliyor</Badge>;
        }
    };

    return (
        <Card className={cn(
            "p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300",
            doc.validationError && "border-2 border-red-500 animate-shake shadow-red-100 shadow-lg"
        )}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "p-3 rounded-lg",
                    doc.status === 'approved' ? 'bg-green-100' : 'bg-gray-100',
                    doc.validationError && "bg-red-50"
                )}>
                    {doc.status === 'approved' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                        <Clock className={cn("h-6 w-6", doc.validationError ? "text-red-500" : "text-gray-500")} />
                    )}
                </div>
                <div>
                    <h4 className={cn("font-semibold", doc.validationError ? "text-red-700" : "text-gray-900")}>
                        {doc.label} {doc.validationError && "(Zorunlu Alan)"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(doc.status)}
                        {doc.fileName && <span className="text-xs text-gray-500 max-w-[200px] truncate">{doc.fileName}</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                {doc.status === 'pending' || doc.status === 'rejected' ? (
                    <div {...getRootProps()} className={cn(
                        "flex-1 sm:flex-none cursor-pointer border-2 border-dashed rounded-lg px-6 py-2 transition-colors",
                        isDragActive ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-blue-400',
                        doc.validationError && 'border-red-300 bg-red-50 hover:border-red-500'
                    )}>
                        <input {...getInputProps()} />
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <UploadCloud className={cn("h-4 w-4", doc.validationError && "text-red-500")} />
                            <span className={doc.validationError ? "text-red-600 font-medium" : ""}>
                                {isDragActive ? 'Bırak...' : doc.validationError ? 'Lütfen Yükleyin' : 'Dosya Seç'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <Button variant="outline" size="sm" onClick={() => onPreview(doc)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Önizle
                        </Button>
                        {(doc.status === 'uploaded') && (
                            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}

export function DocumentUploadList() {
    const { documents, setValidationError } = useDocStore();
    const { setStep } = useFunnelStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        let hasError = false;

        // Validation Check
        documents.forEach(doc => {
            if (doc.status === 'pending') {
                setValidationError(doc.id, true);
                hasError = true;
            } else {
                setValidationError(doc.id, false);
            }
        });

        if (hasError) {
            toast.error("Lütfen tüm zorunlu belgeleri yükleyiniz.");
            setIsSubmitting(false);

            setTimeout(() => {
                documents.forEach(doc => {
                    if (doc.status === 'pending') setValidationError(doc.id, false);
                });
            }, 2000);
            return;
        }

        // Success Flow
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Belgeleriniz onaya gönderildi.");
        setStep(FunnelStep.CONTRACT_APPROVAL);
        router.push("/contract");
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>

            <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{previewDoc?.label}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto bg-gray-50 rounded-lg flex items-center justify-center p-4 border">
                        {previewDoc?.fileUrl ? (
                            previewDoc.fileName?.endsWith('.pdf') ? (
                                <iframe src={previewDoc.fileUrl} className="w-full h-full" />
                            ) : (
                                <img src={previewDoc.fileUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg" />
                            )
                        ) : (
                            <div className="text-center text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Dosya önizlemesi yüklenemedi.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                {documents.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} onPreview={setPreviewDoc} />
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 w-full md:w-auto"
                >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Kontrol Ediliyor..." : "Onaya Gönder"}
                </Button>
            </div>
        </div>
    );
}
