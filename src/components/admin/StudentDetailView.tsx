"use client";

import { updateStudentStep } from "@/actions/admin/update-step";
import { updateDocumentStatus } from "@/actions/admin/manage-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StudentDetailViewProps {
    student: any; // Type better in production
}

export function StudentDetailView({ student }: StudentDetailViewProps) {
    const router = useRouter();

    const steps = [
        { id: 1, label: "Program Seçimi" },
        { id: 2, label: "Evrak Toplama" },
        { id: 3, label: "Sözleşme Onayı" },
        { id: 4, label: "Yeminli Tercüme" },
        { id: 5, label: "Başvuru" },
        { id: 6, label: "Uçuş" },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === student.onboardingStep);
    const currentStepLabel = steps[currentStepIndex]?.label || "Bilinmiyor";

    const handleStepChange = async (newStep: number) => {
        try {
            await updateStudentStep(student.id, newStep);
            toast.success(`Öğrenci aşaması güncellendi: ${steps.find(s => s.id === newStep)?.label}`);
            router.refresh();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    const handleDocStatus = async (docId: string, status: "approved" | "rejected") => {
        try {
            await updateDocumentStatus(docId, status);
            toast.success(`Belge durumu: ${status === "approved" ? "Onaylandı" : "Reddedildi"}`);
            router.refresh();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
                    <p className="text-muted-foreground">{student.email}</p>
                </div>
                <Badge variant={student.emailVerified ? "default" : "destructive"}>
                    {student.emailVerified ? "Email Onaylı" : "Onay Bekliyor"}
                </Badge>
            </div>

            <Separator />

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Progress Control */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Süreç Yönetimi</CardTitle>
                            <CardDescription>Öğrencinin mevcut aşamasını buradan değiştirebilirsiniz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <span className="text-sm text-muted-foreground">Şu Anki Aşama</span>
                                <div className="text-xl font-bold text-orange-700 mt-1">
                                    {currentStepLabel}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    Adım {student.onboardingStep} / 6
                                </div>
                            </div>

                            <div className="flex justify-between gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleStepChange(student.onboardingStep - 1)}
                                    disabled={student.onboardingStep <= 1}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => handleStepChange(student.onboardingStep + 1)}
                                    disabled={student.onboardingStep >= 6}
                                >
                                    İleri <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Information & Documents */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="documents">
                        <TabsList>
                            <TabsTrigger value="documents">Evraklar</TabsTrigger>
                            <TabsTrigger value="programs">Seçilen Programlar</TabsTrigger>
                            <TabsTrigger value="contract">Sözleşme</TabsTrigger>
                        </TabsList>

                        {/* Documents Tab */}
                        <TabsContent value="documents" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Yüklenen Belgeler</CardTitle>
                                    <CardDescription>Öğrencinin yüklediği belgeleri buradan kontrol edin.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {student.documents && student.documents.length > 0 ? (
                                        <div className="space-y-4">
                                            {student.documents.map((doc: any) => (
                                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <FileText className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{doc.label}</p>
                                                            <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {doc.status === "pending" || doc.status === "reviewing" ? (
                                                            <>
                                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDocStatus(doc.id, "approved")}>
                                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Onayla
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDocStatus(doc.id, "rejected")}>
                                                                    <XCircle className="h-4 w-4 mr-1" /> Reddet
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Badge variant={doc.status === "approved" ? "default" : "destructive"}>
                                                                {doc.status === "approved" ? "Onaylandı" : "Reddedildi"}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Henüz belge yüklenmemiş.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Programs Tab - Placeholder */}
                        <TabsContent value="programs" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Program Tercihleri</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Bu özellik henüz aktif değil.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contract Tab - Placeholder */}
                        <TabsContent value="contract" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sözleşme Yönetimi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Buradan sözleşme yükleyebileceksiniz.</p>
                                    <Button className="mt-4">Sözleşme Yükle</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
