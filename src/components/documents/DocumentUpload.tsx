"use client";

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
import { updateDocumentStatus, uploadContract, uploadDocument, deleteDocument, submitDocumentsForReview } from "@/actions/documents";

// Define Document interface locally to avoid undefined issues if store is removed
interface Document {
    id: string;
    type: string;
    label: string;
    status: string | null; // "pending" | "uploaded" | "reviewing" | "approved" | "rejected"
    fileName: string | null;
    fileUrl: string | null;
    rejectionReason: string | null;
    validationError?: boolean;
}

function DocumentItem({ doc, onPreview, onStatusChange }: { doc: Document, onPreview: (doc: Document) => void, onStatusChange: (id: string, status: "uploaded" | "pending", fileName?: string, fileUrl?: string, type?: string, label?: string) => Promise<void> | void }) {

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            try {
                // In a real app, upload to S3 here.
                const url = URL.createObjectURL(file);
                // Call parent handler which calls server action
                await onStatusChange(doc.id, 'uploaded', file.name, url, doc.type, doc.label);
                toast.success(`${doc.label} başarıyla yüklendi: ${file.name}`);
            } catch (error) {
                toast.error("Yükleme sırasında bir hata oluştu.");
            }
        }
    }, [doc.id, doc.type, doc.label, onStatusChange]);

    const onDelete = async () => {
        try {
            await deleteDocument(doc.id);
            onStatusChange(doc.id, 'pending');
            toast.info(`${doc.label} silindi.`);
        } catch (error) {
            toast.error("Silme işlemi başarısız oldu.");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png'] },
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: doc.status === 'approved' || doc.status === 'reviewing'
    });

    const getStatusBadge = (status: string | null) => {
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
                {doc.status === 'pending' || doc.status === 'rejected' || !doc.status ? (
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

export function DocumentUploadList({ initialDocuments }: { initialDocuments: any[] }) {
    // Merge initial DB docs with required list. 
    // In a real app, the DB should be the source of truth, but for now we might need to ensuring 
    // required document types exist in the UI even if not in DB yet.

    // Simplification: We will just use the passed documents for now, assuming parent does the merging if needed.
    // Or better: Parent (Page) fetches DB docs. Here we align them with a static list of "Required" document types.

    const requiredTypes = [
        { type: "passport", label: "Pasaport veya Kimlik" },
        { type: "diploma", label: "Lise Diploması" },
        { type: "transcript", label: "Transkript" },
        { type: "biometric", label: "Biyometrik Fotoğraf" }
    ];

    // Combine DB docs with required types
    const [documents, setDocuments] = useState<Document[]>(() => {
        return requiredTypes.map(req => {
            const existing = initialDocuments.find((d: any) => d.type === req.type);
            return {
                id: existing?.id || req.type, // Use type as ID if not in DB (not ideal for real DB but works for UI)
                type: req.type,
                label: req.label,
                status: existing?.status || "pending",
                fileName: existing?.fileName || null,
                fileUrl: existing?.fileUrl || null,
                rejectionReason: existing?.rejectionReason || null,
                validationError: false
            };
        });
    });

    const { setStep } = useFunnelStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

    const handleStatusChange = async (id: string, status: "uploaded" | "pending", fileName?: string, fileUrl?: string, type?: string, label?: string) => {
        setDocuments(prev => prev.map(doc => {
            if (doc.id === id || doc.type === id) {
                return { ...doc, status, fileName: fileName || null, fileUrl: fileUrl || null, validationError: false };
            }
            return doc;
        }));

        // Persist to database
        if (status === "uploaded" && fileName && fileUrl && type && label) {
            try {
                await uploadDocument(type, fileName, fileUrl, label);
            } catch (e) {
                console.error("Failed to upload document:", e);
            }
        }
    };

    // Check if all documents are approved
    const allDocumentsApproved = documents.length > 0 && documents.every(doc => doc.status === "approved");

    // Check if any documents are in review (but not all approved)
    const hasDocumentsInReview = !allDocumentsApproved && documents.some(
        doc => doc.status === "reviewing" || doc.status === "approved"
    );

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Check if already in review
        if (hasDocumentsInReview) {
            toast.info("Belgeleriniz zaten inceleme aşamasında.");
            setIsSubmitting(false);
            return;
        }

        let hasError = false;

        // Validation Check
        const newDocs = documents.map(doc => {
            if (doc.status === 'pending' || !doc.status) {
                hasError = true;
                return { ...doc, validationError: true };
            }
            return { ...doc, validationError: false };
        });

        setDocuments(newDocs);

        if (hasError) {
            toast.error("Lütfen tüm zorunlu belgeleri yükleyiniz.");
            setIsSubmitting(false);

            setTimeout(() => {
                setDocuments(prev => prev.map(d => ({ ...d, validationError: false })));
            }, 2000);
            return;
        }

        // Submit to server
        try {
            const result = await submitDocumentsForReview();

            if (result.success) {
                toast.success(result.message);
                // Update local state to reflect reviewing status
                setDocuments(prev => prev.map(doc =>
                    doc.status === "uploaded" ? { ...doc, status: "reviewing" } : doc
                ));
                setStep(FunnelStep.CONTRACT_APPROVAL);
                // Stay on page, don't navigate
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }

        setIsSubmitting(false);
    };

    const handleNextStep = () => {
        router.push("/contract");
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
                    <DocumentItem key={doc.id} doc={doc} onPreview={setPreviewDoc} onStatusChange={handleStatusChange} />
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
                {allDocumentsApproved ? (
                    <Button
                        size="lg"
                        onClick={handleNextStep}
                        className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Sonraki Adım
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting || hasDocumentsInReview}
                        className="bg-primary hover:bg-primary/90 w-full md:w-auto"
                    >
                        {hasDocumentsInReview ? (
                            <>
                                <Clock className="mr-2 h-4 w-4" />
                                İncelemede
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Kontrol Ediliyor..." : "Onaya Gönder"}
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

