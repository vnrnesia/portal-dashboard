import { getStudents } from "@/actions/admin/get-students";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Eye, Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APPLICATION_STEPS } from "@/lib/constants";

interface PageProps {
    searchParams: Promise<{ step?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const stepFilter = params.step ? parseInt(params.step) : null;

    const allStudents = await getStudents();

    // Filter by step if provided
    const students = stepFilter
        ? allStudents.filter(s => (s.onboardingStep || 1) === stepFilter)
        : allStudents;

    // Create step labels from constants
    const stepLabels: Record<number, string> = {};
    APPLICATION_STEPS.forEach(step => {
        stepLabels[step.id] = step.label;
    });

    const currentStepName = stepFilter ? stepLabels[stepFilter] : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {stepFilter ? `${currentStepName} Aşamasındaki Öğrenciler` : "Öğrenci Listesi"}
                    </h1>
                    <p className="text-muted-foreground">
                        {stepFilter
                            ? `${students.length} öğrenci bu aşamada bulunuyor.`
                            : "Tüm kayıtlı öğrencilerin durumlarını buradan takip edebilirsiniz."
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {stepFilter && (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/users">
                                <X className="h-4 w-4 mr-1" />
                                Filtreyi Kaldır
                            </Link>
                        </Button>
                    )}
                    <Badge variant="outline" className="py-1.5 px-3">
                        <Users className="h-4 w-4 mr-1" />
                        {students.length} Öğrenci
                    </Badge>
                </div>
            </div>

            {/* Step Filter Badges */}
            <div className="flex flex-wrap gap-2">
                <Link href="/admin/users">
                    <Badge
                        variant={!stepFilter ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90"
                    >
                        Tümü ({allStudents.length})
                    </Badge>
                </Link>
                {APPLICATION_STEPS.map((step) => {
                    const count = allStudents.filter(s => (s.onboardingStep || 1) === step.id).length;
                    return (
                        <Link key={step.id} href={`/admin/users?step=${step.id}`}>
                            <Badge
                                variant={stepFilter === step.id ? "default" : "outline"}
                                className="cursor-pointer hover:bg-primary/90"
                            >
                                {step.title} ({count})
                            </Badge>
                        </Link>
                    );
                })}
            </div>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Öğrenciler</CardTitle>
                    <CardDescription>
                        Öğrenci detaylarını görmek için "İncele" butonuna tıklayın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Öğrenci</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Kayıt Durumu</TableHead>
                                <TableHead>Mevcut Aşama</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {stepFilter
                                            ? "Bu aşamada öğrenci bulunmuyor."
                                            : "Henüz kayıtlı öğrenci yok."
                                        }
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={student.image || ""} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {student.name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {student.phone || "Telefon yok"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{student.email}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={student.emailVerified ? "default" : "secondary"}>
                                                {student.emailVerified ? "Onaylı" : "Beklemede"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-primary">
                                                            {student.onboardingStep || 1}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm">
                                                        {stepLabels[student.onboardingStep || 1] || "Bilinmiyor"}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/admin/users/${student.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    İncele
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
