"use client";

import { updateStudentStep } from "@/actions/admin/update-step";
import { updateDocumentStatus } from "@/actions/admin/manage-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, FileText, ArrowLeft, ArrowRight, Truck, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { APPLICATION_STEPS, STEP_REQUIREMENTS } from "@/lib/constants";

interface StudentDetailViewProps {
    student: any; // Type better in production
}

export function StudentDetailView({ student }: StudentDetailViewProps) {
    const router = useRouter();

    // Use constants instead of local definition


    const handleStepChange = async (newStep: number) => {
        try {
            await updateStudentStep(student.id, newStep);
            toast.success(`Öğrenci aşaması güncellendi: ${APPLICATION_STEPS.find(s => s.id === newStep)?.label}`);
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
                            <CardDescription>Öğrenci ilerlemesini buradan yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-0 p-0">
                            {/* Vertical Steps List */}
                            <div className="divide-y">
                                {APPLICATION_STEPS.map((step) => {
                                    const isCompleted = student.onboardingStep > step.id;
                                    const isCurrent = student.onboardingStep === step.id;
                                    const isLocked = student.onboardingStep < step.id;

                                    // Check if we can move to this step (admin override or sequential)
                                    // Actually, we usually only move forward one by one.
                                    // Let's allow moving to next step if requirements met.
                                    // For simplicity in this vertical view:
                                    // Show "Current" for current.
                                    // Show "Complete" button for current if not last.
                                    // Show "Move Here" for past steps (rollback).
                                    // Lock future steps except immediate next.

                                    const isNext = step.id === student.onboardingStep + 1;

                                    // Check requirements for moving TO this step (or finishing previous)
                                    // Actually requirements usually block finishing the current step to go to next.
                                    // So if we are at step 3, we check requirements of 3 to go to 4.

                                    const reqs = STEP_REQUIREMENTS[student.onboardingStep] || [];
                                    const missingDocs = reqs.filter(reqType =>
                                        !student.documents?.some((d: any) => d.type === reqType && d.status === "approved")
                                    );

                                    const canMoveToNext = missingDocs.length === 0;

                                    return (
                                        <div key={step.id} className={`flex items-center justify-between p-4 ${isCurrent ? 'bg-blue-50' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border
                                                    ${isCompleted ? 'bg-green-100 text-green-700 border-green-200' :
                                                        isCurrent ? 'bg-blue-600 text-white border-blue-600' :
                                                            'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-xs text-blue-600">Şu anki aşama</p>
                                                    )}
                                                    {isNext && !canMoveToNext && (
                                                        <p className="text-xs text-amber-600">Belge bekleniyor</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions - Only rollback allowed */}
                                            {isCompleted && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                                    onClick={() => handleStepChange(step.id)}
                                                    title="Bu aşamaya geri dön"
                                                >
                                                    <ArrowLeft className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
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
                            <TabsTrigger value="application">Üniversite Başvuru</TabsTrigger>
                            <TabsTrigger value="flight">Uçuş & Karşılama</TabsTrigger>
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
                                                            <p className="text-xs text-muted-foreground">{doc.fileName || "Dosya yok"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* View File Button */}
                                                        {doc.fileUrl && (
                                                            <Button size="sm" variant="outline" asChild>
                                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                    Dosyayı Gör
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {doc.status === "pending" || doc.status === "uploaded" || doc.status === "reviewing" ? (
                                                            <>
                                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDocStatus(doc.id, "approved")}>
                                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Onayla
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDocStatus(doc.id, "rejected")}>
                                                                    <XCircle className="h-4 w-4 mr-1" /> Reddet
                                                                </Button>
                                                            </>
                                                        ) : doc.status === "approved" ? (
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="default">Onaylandı</Badge>
                                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDocStatus(doc.id, "rejected")}>
                                                                    <XCircle className="h-4 w-4 mr-1" /> Reddet
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="destructive">Reddedildi</Badge>
                                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDocStatus(doc.id, "approved")}>
                                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Onayla
                                                                </Button>
                                                            </div>
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

                        {/* Programs Tab */}
                        <TabsContent value="programs" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Seçilen Program</CardTitle>
                                    <CardDescription>Öğrencinin tercih ettiği üniversite ve bölüm.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {student.selectedProgram ? (
                                        <div className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50">
                                            <div className="h-16 w-16 rounded-lg bg-white border flex items-center justify-center font-bold text-gray-500 text-xl shadow-sm">
                                                {student.selectedProgram.logo}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-lg">{student.selectedProgram.name}</h3>
                                                <p className="text-gray-700 font-medium">{student.selectedProgram.university}</p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                                                    <span className="flex items-center gap-1">📍 {student.selectedProgram.city}, {student.selectedProgram.country}</span>
                                                    <span className="flex items-center gap-1">💰 {student.selectedProgram.tuition}</span>
                                                    <span className="flex items-center gap-1">🗣️ {student.selectedProgram.language}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">
                                            <p>Öğrenci henüz bir program seçimi yapmamış.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contract Tab */}
                        <TabsContent value="contract" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sözleşme Yönetimi</CardTitle>
                                    <CardDescription>Öğrenci için sözleşme taslağı yükleyin.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm">Sözleşme Dosyası</h3>
                                        <div className="p-4 bg-gray-50 border rounded-lg">
                                            {student.documents?.find((d: any) => d.type === "admin_contract") ? (
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <FileText className="h-5 w-5 text-purple-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-purple-900">Sözleşme Yüklendi</p>
                                                            <p className="text-xs text-purple-700">
                                                                {student.documents.find((d: any) => d.type === "admin_contract")?.fileName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Değiştir
                                                    </Button>
                                                </div>
                                            ) : null}

                                            {/* Upload Form - Always visible to allow re-upload/replace logic if we handle it */}
                                            <form action={async (formData) => {
                                                const { uploadAdminContract } = await import("@/actions/admin/upload-contract");
                                                const res = await uploadAdminContract(student.id, formData);
                                                if (res.success) {
                                                    toast.success(res.message);
                                                    router.refresh();
                                                } else {
                                                    toast.error(res.message);
                                                }
                                            }} className="flex gap-4 items-end">
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <label htmlFor="adminContract" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Sözleşme Seç (PDF)
                                                    </label>
                                                    <input
                                                        id="adminContract"
                                                        name="file"
                                                        type="file"
                                                        accept=".pdf"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit">Yükle</Button>
                                            </form>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Application Tab - New */}
                        <TabsContent value="application" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Üniversite Başvuru Yönetimi</CardTitle>
                                    <CardDescription>Başvuru durumu ve davet mektubu yükleme.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm">Davet Mektubu (Acceptance Letter)</h3>
                                        <div className="p-4 bg-gray-50 border rounded-lg">
                                            {student.documents?.find((d: any) => d.type === "invitation_letter") ? (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <FileText className="h-5 w-5 text-green-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-green-900">Davet Mektubu Yüklendi</p>
                                                            <p className="text-xs text-green-700">
                                                                {student.documents.find((d: any) => d.type === "invitation_letter")?.fileName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDocStatus(student.documents.find((d: any) => d.type === "invitation_letter").id, "rejected")}>
                                                        Kaldır
                                                    </Button>
                                                </div>
                                            ) : (
                                                <form action={async (formData) => {
                                                    const { uploadInvitationLetter } = await import("@/actions/admin/upload-invitation");
                                                    const res = await uploadInvitationLetter(student.id, formData);
                                                    if (res.success) {
                                                        toast.success(res.message);
                                                        router.refresh();
                                                    } else {
                                                        toast.error(res.message);
                                                    }
                                                }} className="flex gap-4 items-end">
                                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                                        <label htmlFor="invitation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Dosya Seç
                                                        </label>
                                                        <input
                                                            id="invitation"
                                                            name="file"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            required
                                                        />
                                                    </div>
                                                    <Button type="submit">Yükle</Button>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    {/* Visa Tracking Code Section */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-semibold text-sm">Vize Kargo Takip Kodu</h3>
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4">
                                            {student.visaTrackingCode ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Truck className="h-5 w-5 text-blue-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-blue-900">Kargo Takip Kodu</p>
                                                        <p className="text-lg font-mono tracking-wider text-blue-700">
                                                            {student.visaTrackingCode}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-blue-800 flex items-center gap-2">
                                                    <Info className="h-4 w-4" />
                                                    Öğrenci henüz takip kodu girmedi.
                                                </div>
                                            )}

                                            {/* Visa Receipt Display */}
                                            {student.documents?.find((d: any) => d.type === "visa_receipt") && (
                                                <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-900">Kargo Makbuzu</p>
                                                            <p className="text-xs text-blue-700">
                                                                {student.documents.find((d: any) => d.type === "visa_receipt")?.fileName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-100" asChild>
                                                        <a href={student.documents.find((d: any) => d.type === "visa_receipt")?.fileUrl} target="_blank" rel="noopener noreferrer">
                                                            Görüntüle
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="flight" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Uçuş ve Karşılama Yönetimi</CardTitle>
                                    <CardDescription>Uçuş bileti ve karşılama detayları.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm">Uçuş Bileti</h3>
                                        <div className="p-4 bg-gray-50 border rounded-lg">
                                            {student.documents?.find((d: any) => d.type === "flight_ticket") ? (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                                            <FileText className="h-5 w-5 text-indigo-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-indigo-900">Bilet Yüklendi</p>
                                                            <p className="text-xs text-indigo-700">
                                                                {student.documents.find((d: any) => d.type === "flight_ticket")?.fileName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild className="mr-2">
                                                        <a href={student.documents.find((d: any) => d.type === "flight_ticket")?.fileUrl} target="_blank" rel="noopener noreferrer">Gör</a>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <form action={async (formData) => {
                                                    const { uploadFlightTicket } = await import("@/actions/admin/upload-flight-ticket");
                                                    const res = await uploadFlightTicket(student.id, formData);
                                                    if (res.success) {
                                                        toast.success(res.message);
                                                        router.refresh();
                                                    } else {
                                                        toast.error(res.message);
                                                    }
                                                }} className="flex gap-4 items-end">
                                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                                        <label htmlFor="flightTicket" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Bilet Seç (PDF/Resim)
                                                        </label>
                                                        <input
                                                            id="flightTicket"
                                                            name="file"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            required
                                                        />
                                                    </div>
                                                    <Button type="submit">Yükle</Button>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                                        <Info className="h-4 w-4 inline-block mr-2 mb-0.5" />
                                        Detaylı uçuş bilgileri (Tarih, Saat, Havalimanı) girişi yakında eklenecektir. Şimdilik sadece bilet dokümanı takibi yapılmaktadır.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
