import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TranslationLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header - Static content */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tercüme İşlemleri</h1>
                <p className="text-gray-500">Üniversite başvurusu için gerekli belgelerin yeminli tercümesi gerekmektedir.</p>
            </div>

            {/* Info Card - Static content */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-100 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-orange-800">Önemli Bilgilendirme</h4>
                    <p className="text-sm text-orange-700">
                        Tercüme belgeleri noter onaylı ve yeminli tercüman tarafından yapılmış olmalıdır.
                        Yüklenen belgeler danışmanlarımız tarafından 24 saat içinde incelenecektir.
                    </p>
                </div>
            </div>

            {/* Translation Documents Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32 sm:w-48" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto flex justify-end">
                            <Skeleton className="h-10 w-full md:w-auto px-8 rounded-lg" />
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
