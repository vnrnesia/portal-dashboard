import { getDashboardStats } from "@/actions/admin/get-students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, FileCheck, Clock, GraduationCap, CalendarPlus } from "lucide-react";
import { APPLICATION_STEPS } from "@/lib/constants";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    const statCards = [
        {
            title: "Toplam Öğrenci",
            value: stats.totalStudents,
            icon: Users,
            description: "Kayıtlı toplam öğrenci sayısı",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Aktif Başvurular",
            value: stats.activeApplications,
            icon: TrendingUp,
            description: "İşlem devam eden öğrenciler",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Tamamlanan",
            value: stats.completedStudents,
            icon: GraduationCap,
            description: "Süreci tamamlayan öğrenciler",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Bu Hafta Yeni",
            value: stats.newStudentsThisWeek,
            icon: CalendarPlus,
            description: "Son 7 günde kayıt",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Bekleyen Belgeler",
            value: stats.pendingDocuments,
            icon: Clock,
            description: "Onay bekleyen belgeler",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Öğrenci başvuru süreçlerinin genel görünümü
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Step Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Aşama Dağılımı</CardTitle>
                    <CardDescription>Her aşamadaki öğrenci sayısı</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
                        {APPLICATION_STEPS.map((step) => {
                            const count = stats.stepDistribution[step.id] || 0;
                            const percentage = stats.totalStudents > 0
                                ? Math.round((count / stats.totalStudents) * 100)
                                : 0;

                            return (
                                <a
                                    key={step.id}
                                    href={`/admin/users?step=${step.id}`}
                                    className="block"
                                >
                                    <div className="flex flex-col items-center p-4 rounded-lg border bg-card hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <span className="text-lg font-bold text-primary">{step.id}</span>
                                        </div>
                                        <span className="text-2xl font-bold">{count}</span>
                                        <span className="text-xs text-muted-foreground text-center mt-1">
                                            {step.title}
                                        </span>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-primary h-1.5 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {percentage}%
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <a href="/admin/users">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Öğrenci Listesi
                            </CardTitle>
                            <CardDescription>
                                Tüm öğrencileri görüntüle ve yönet
                            </CardDescription>
                        </CardHeader>
                    </a>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <a href="/admin/users">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5 text-green-600" />
                                Belge İncele
                            </CardTitle>
                            <CardDescription>
                                Bekleyen belgeleri incele ve onayla
                            </CardDescription>
                        </CardHeader>
                    </a>
                </Card>
            </div>
        </div>
    );
}
