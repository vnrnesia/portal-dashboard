import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function FlightLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <Skeleton className="h-9 w-64 mx-auto" />
                <Skeleton className="h-5 w-96 mx-auto" />
            </div>

            {/* Main Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                    <Skeleton className="h-20 w-full rounded-none" />
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-12 w-32" />
                            <Skeleton className="h-9 w-28 rounded-lg" />
                        </div>
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                </Card>

                <Card className="p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div>
                            <Skeleton className="h-5 w-40 mb-2" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
