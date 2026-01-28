"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, Clock, Eye, Send, FileText, Trash2, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { uploadDocument, deleteDocument, submitDocumentsForReview } from "@/actions/documents";

// Translation document types
const TRANSLATION_DOCUMENTS = [
    { id: "passport_translation", type: "passport_translation", label: "Pasaport Çevirisi", required: true },
    { id: "diploma_translation", type: "diploma_translation", label: "Diploma Tercümesi", required: true },
    { id: "transcript_translation", type: "transcript_translation", label: "Transkript Tercümesi", required: true },
];

interface TranslationDoc {
    id: string;
    type: string;
    label: string;
    status: "pending" | "uploaded" | "reviewing" | "approved" | "rejected";
    fileName?: string | null;
    fileUrl?: string | null;
    validationError?: boolean;
    required: boolean;
}

interface TranslationDocItemProps {
    doc: TranslationDoc;
    onPreview: (doc: TranslationDoc) => void;
    onStatusChange: (id: string, status: "uploaded" | "pending", fileName?: string, fileUrl?: string, type?: string, label?: string) => void;
}

function TranslationDocItem({ doc, onPreview, onStatusChange }: TranslationDocItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const fakeUrl = URL.createObjectURL(file);

            try {
                // Save to database
                await uploadDocument(doc.type, file.name, fakeUrl, doc.label);
                onStatusChange(doc.id, "uploaded", file.name, fakeUrl, doc.type, doc.label);
                toast.success(`${doc.label} yüklendi.`);
            } catch (error) {
                toast.error("Yükleme başarısız oldu.");
            }
        }
    }, [doc.id, doc.type, doc.label, onStatusChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxFiles: 1,
        disabled: doc.status === 'reviewing' || doc.status === 'approved'
    });

    const handleDelete = async () => {
        if (doc.status !== 'uploaded') {
            toast.error("Sadece yüklenen belgeler silinebilir.");
            return;
        }

        setIsDeleting(true);
        try {
            await deleteDocument(doc.id);
            onStatusChange(doc.id, 'pending');
            toast.info(`${doc.label} silindi.`);
        } catch (error) {
            toast.error("Silme işlemi başarısız oldu.");
        }
        setIsDeleting(false);
    };

    const statusConfig = {
        pending: { color: "bg-gray-100 text-gray-600 border-gray-200", text: "Bekleniyor" },
        uploaded: { color: "bg-blue-100 text-blue-700 border-blue-200", text: "Yüklendi" },
        reviewing: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", text: "İnceleniyor" },
        approved: { color: "bg-green-100 text-green-700 border-green-200", text: "Onaylandı" },
        rejected: { color: "bg-red-100 text-red-700 border-red-200", text: "Reddedildi" }
    };

    const currentStatus = statusConfig[doc.status] || statusConfig.pending;
    const isInteractive = doc.status === 'uploaded';

    return (
        <Card className={cn(
            "p-5 transition-all duration-300 border-2",
            isDragActive && "border-primary bg-primary/5 scale-[1.01]",
            doc.status === 'approved' && "border-green-200 bg-green-50/50",
            doc.status === 'reviewing' && "border-yellow-200 bg-yellow-50/50",
            doc.validationError && "border-red-500 animate-shake"
        )}>
            <div className="flex items-start gap-4">
                <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    doc.status === 'approved' ? "bg-green-100" :
                        doc.status === 'reviewing' ? "bg-yellow-100" :
                            doc.status === 'uploaded' ? "bg-blue-100" : "bg-gray-100"
                )}>
                    {doc.status === 'approved' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : doc.status === 'reviewing' ? (
                        <Clock className="h-6 w-6 text-yellow-600" />
                    ) : (
                        <FileText className="h-6 w-6 text-gray-500" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{doc.label}</h3>
                        <Badge variant="outline" className={cn("text-xs", currentStatus.color)}>
                            {currentStatus.text}
                        </Badge>
                    </div>

                    {doc.status === 'pending' ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "mt-3 border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer",
                                isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex items-center gap-3">
                                <UploadCloud className="h-5 w-5 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    {isDragActive ? "Bırakın..." : "Yüklemek için tıklayın veya sürükleyin"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                            <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-gray-600 truncate">{doc.fileName}</span>
                        </div>
                    )}
                </div>

                {doc.status !== 'pending' && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-primary"
                            onClick={() => onPreview(doc)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {isInteractive && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}

interface TranslationUploadClientProps {
    initialDocuments: any[];
    userName: string;
}

export default function TranslationUploadClient({ initialDocuments, userName }: TranslationUploadClientProps) {
    const router = useRouter();
    const [previewDoc, setPreviewDoc] = useState<TranslationDoc | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize documents state from database
    const [documents, setDocuments] = useState<TranslationDoc[]>(() => {
        return TRANSLATION_DOCUMENTS.map(docType => {
            const existingDoc = initialDocuments.find(d => d.type === docType.type);
            if (existingDoc) {
                return {
                    id: existingDoc.id || docType.id,
                    type: docType.type,
                    label: docType.label,
                    status: existingDoc.status || "pending",
                    fileName: existingDoc.fileName,
                    fileUrl: existingDoc.fileUrl,
                    required: docType.required
                };
            }
            return {
                id: docType.id,
                type: docType.type,
                label: docType.label,
                status: "pending" as const,
                required: docType.required
            };
        });
    });

    const handleStatusChange = async (
        id: string,
        status: "uploaded" | "pending",
        fileName?: string,
        fileUrl?: string,
        type?: string,
        label?: string
    ) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status, fileName, fileUrl, validationError: false } : doc
        ));
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
            if (doc.required && (doc.status === 'pending' || !doc.status)) {
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

        // Submit - update all uploaded documents to reviewing in database
        try {
            const result = await submitDocumentsForReview(4); // Step 4 = Translation

            if (result.success) {
                toast.success(result.message);
                // Update local state
                setDocuments(prev => prev.map(doc =>
                    doc.status === "uploaded" ? { ...doc, status: "reviewing" } : doc
                ));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        }

        setIsSubmitting(false);
    };

    const handleNextStep = () => {
        router.push("/application-status");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
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

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tercüme İşlemleri</h1>
                <p className="text-gray-500">Üniversite başvurusu için gerekli belgelerin yeminli tercümesi gerekmektedir.</p>
            </div>

            {/* Warning Card */}
            <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-100 rounded-full mt-0.5">
                        <FileText className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-orange-800">Önemli Bilgilendirme</h4>
                        <p className="text-sm text-orange-700">
                            Tercüme belgeleri noter onaylı ve yeminli tercüman tarafından yapılmış olmalıdır.
                            Yüklenen belgeler danışmanlarımız tarafından 24 saat içinde incelenecektir.
                        </p>
                    </div>
                </div>
            </Card>

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
                    <TranslationDocItem key={doc.id} doc={doc} onPreview={setPreviewDoc} onStatusChange={handleStatusChange} />
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
                        Onaylandı - Sonraki Adım
                        <ArrowRight className="ml-2 h-4 w-4" />
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
