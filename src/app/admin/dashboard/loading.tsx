import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="w-10 h-10 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-20" />
                    </Card>
                ))}
            </div>

            {/* Users Table */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 pb-4 border-b">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                    {/* Table Rows */}
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="grid grid-cols-5 gap-4 py-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-20 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
