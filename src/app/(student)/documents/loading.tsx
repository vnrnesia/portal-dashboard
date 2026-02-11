import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DocumentsLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header - Static content to match page.tsx */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Evrak Yönetimi</h1>
                <p className="text-gray-500">Başvurunuzun tamamlanması için aşağıdaki belgeleri yükleyiniz.</p>
            </div>

            {/* Info Banner - Static content to match page.tsx */}
            <div className="bg-orange-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 mt-0.5" /> {/* Placeholder for icon since we can't import AlertCircle easily or just use div */}
                <div className="text-sm text-blue-800">
                    <p className="font-semibold">Önemli Bilgilendirme</p>
                    <p>Belgeleriniz <strong>PDF, JPEG veya PNG</strong> formatında ve maksimum <strong>5MB</strong> boyutunda olmalıdır. Yüklenen belgeler danışmanlarımız tarafından 24 saat içinde incelenecektir.</p>
                </div>
            </div>

            {/* Document List Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32 sm:w-48" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-24 hidden sm:block" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto flex justify-end">
                            <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                        </div>
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
