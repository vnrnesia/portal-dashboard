import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ContractLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center">
                <Skeleton className="h-9 w-56 mx-auto mb-2" />
                <Skeleton className="h-5 w-80 mx-auto" />
            </div>

            {/* Step 1 */}
            <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Skeleton className="h-[400px] w-full rounded-lg mb-4" />
                <Skeleton className="h-10 w-48" />
            </Card>

            {/* Step 2 */}
            <Card className="p-6">
                <div className="flex items-start gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-44 mb-2" />
                        <Skeleton className="h-4 w-80" />
                        <Skeleton className="h-32 w-full rounded-lg mt-4" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
