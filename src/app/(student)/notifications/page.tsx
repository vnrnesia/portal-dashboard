import { getNotifications, markAllAsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    CheckCircle2,
    FileText,
    XCircle,
    UploadCloud,
    RefreshCcw,
    CheckCheck,
    Calendar,
    ArrowRight
} from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import { revalidatePath } from "next/cache";

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case "step_completed": return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
            case "document_approved": return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
            case "document_rejected": return <XCircle className="h-5 w-5 text-red-600" />;
            case "document_uploaded": return <UploadCloud className="h-5 w-5 text-indigo-600" />;
            case "application_update": return <RefreshCcw className="h-5 w-5 text-orange-600" />;
            default: return <Bell className="h-5 w-5 text-gray-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "step_completed": return "bg-emerald-100";
            case "document_approved": return "bg-blue-100";
            case "document_rejected": return "bg-red-100";
            case "document_uploaded": return "bg-indigo-100";
            case "application_update": return "bg-orange-100";
            default: return "bg-gray-100";
        }
    };

    async function handleMarkAllAsRead() {
        "use server";
        await markAllAsRead();
        revalidatePath("/notifications");
    }

    // Group notifications by date
    const groupedNotifications = notifications.reduce((acc, notification) => {
        const date = notification.createdAt ? new Date(notification.createdAt) : new Date();
        let key = "Daha Eski";

        if (isToday(date)) key = "Bugün";
        else if (isYesterday(date)) key = "Dün";

        if (!acc[key]) acc[key] = [];
        acc[key].push(notification);
        return acc;
    }, {} as Record<string, typeof notifications>);

    const groups = ["Bugün", "Dün", "Daha Eski"].filter(key => groupedNotifications[key]?.length > 0);

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bildirimler</h1>
                    <p className="text-muted-foreground mt-1">Süreçle ilgili tüm güncellemeler ve aktiviteler.</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <form action={handleMarkAllAsRead}>
                        <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-primary">
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Tümünü okundu işaretle
                        </Button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Bildiriminiz Yok</h3>
                    <p className="text-gray-500 max-w-sm mt-2">
                        Başvuru sürecinizle ilgili önemli güncellemeler olduğunda burada listelenecektir.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {groups.map((group) => (
                        <div key={group}>
                            <h2 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {group}
                            </h2>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                                {groupedNotifications[group].map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`group relative flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`shrink-0 p-2.5 rounded-xl ${getBgColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-x-2">
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {notification.title}
                                                </div>
                                                <time className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                                                    {notification.createdAt && formatDistanceToNow(
                                                        new Date(notification.createdAt),
                                                        { addSuffix: true, locale: tr }
                                                    )}
                                                </time>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
