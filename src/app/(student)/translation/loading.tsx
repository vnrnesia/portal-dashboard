import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TranslationLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-56 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Info Card */}
            <Skeleton className="h-24 w-full rounded-lg" />

            {/* Translation Documents */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div>
                                <Skeleton className="h-5 w-48 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-28 rounded-lg" />
                    </Card>
                ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
                <Skeleton className="h-12 w-40 rounded-lg" />
            </div>
        </div>
    );
}
