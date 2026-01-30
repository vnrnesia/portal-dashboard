import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminUsersLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-40 mb-2" />
                    <Skeleton className="h-5 w-56" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div>
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 flex-1 rounded-lg" />
                            <Skeleton className="h-9 w-9 rounded-lg" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
