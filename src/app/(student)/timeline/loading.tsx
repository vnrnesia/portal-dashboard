import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TimelineLoading() {
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-80 mb-8" />

            <div className="space-y-0">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex gap-4">
                        {/* Line & Icon */}
                        <div className="flex flex-col items-center">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            {i !== 8 && <Skeleton className="w-0.5 h-16 md:h-24 -my-2" />}
                        </div>

                        {/* Content */}
                        <Card className="flex-1 mb-6 p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-40 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded" />
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
