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
import Link from "next/link";
import { Eye, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
    const students = await getStudents();

    // Mapping steps to labels
    const stepLabels: Record<number, string> = {
        1: "Program Seçimi",
        2: "Evrak Toplama",
        3: "Sözleşme Onayı",
        4: "Yeminli Tercüme",
        5: "Başvuru",
        6: "Uçuş",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Öğrenci Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Kayıtlı öğrencilerin durumlarını buradan takip edebilirsiniz.
                    </p>
                </div>
                <Button>Yeni Öğrenci Ekle (Manuel)</Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Öğrenci</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Mevcut Aşama</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Henüz kayıtlı öğrenci yok.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={student.image || ""} />
                                                <AvatarFallback>{student.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {student.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.emailVerified ? "default" : "secondary"}>
                                            {student.emailVerified ? "Onaylı" : "Beklemede"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                {stepLabels[student.onboardingStep || 1] || "Bilinmiyor"}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm" variant="ghost">
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
            </div>
        </div>
    );
}
