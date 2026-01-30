import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-40 rounded-lg hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* CTA Card Skeleton */}
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-28 rounded-full bg-white/30" />
                            <Skeleton className="h-10 w-56 bg-white/30" />
                            <Skeleton className="h-5 w-80 bg-white/30" />
                            <Skeleton className="h-12 w-36 rounded-lg bg-white/50 mt-4" />
                        </div>
                    </div>

                    {/* Notifications + Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <Skeleton className="h-5 w-32 mb-4" />
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-start gap-3 p-3">
                                        <Skeleton className="w-2 h-2 rounded-full mt-2" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="p-6">
                            <Skeleton className="h-5 w-28 mb-4" />
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-20 rounded-lg" />
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card className="p-4">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="w-6 h-6 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
