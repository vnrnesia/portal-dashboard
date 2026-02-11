import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ContractLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header - Static Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Sözleşme Onayı</h1>
                    <p className="text-gray-500">Süreci tamamlamak için aşağıdaki adımları takip ediniz.</p>
                </div>
            </div>

            {/* Step 1: Preview & Download */}
            <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 bg-primary/10 text-primary">
                        1
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Sözleşmeyi İncele ve İndir</h3>
                        <p className="text-sm text-gray-500">Sözleşme metnini kontrol ettikten sonra PDF olarak indiriniz.</p>
                    </div>
                </div>
                <Skeleton className="h-[400px] w-full rounded-lg mb-4" />
                <Skeleton className="h-10 w-48 rounded-lg" />
            </Card>

            {/* Step 2: Print & Sign */}
            <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 bg-primary/10 text-primary">
                        2
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Çıktı Al ve İmzala</h3>
                        <p className="text-sm text-gray-500">İndirdiğiniz PDF'in çıktısını alıp, "Müşteri" kısmını ıslak imza ile imzalayınız.</p>
                    </div>
                </div>
            </Card>

            {/* Step 3: Upload */}
            <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold shrink-0 bg-primary/10 text-primary">
                        3
                    </div>
                    <div className="space-y-1 w-full">
                        <h3 className="font-semibold text-lg">İmzalı Belgeyi Yükle</h3>
                        <p className="text-sm text-gray-500">İçaladığınız belgeyi taratarak veya fotoğrafını çekerek buraya yükleyiniz.</p>

                        <div className="mt-4">
                            <Skeleton className="h-32 w-full rounded-lg border-2 border-dashed" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
