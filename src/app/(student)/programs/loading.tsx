import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProgramsLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 flex-1 max-w-md" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Program Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="overflow-hidden">
                        {/* Image placeholder */}
                        <Skeleton className="h-40 w-full rounded-none" />
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-9 w-20 rounded-lg" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
