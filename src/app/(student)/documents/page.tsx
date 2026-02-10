import { DocumentUploadList } from "@/components/documents/DocumentUpload";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getDocuments } from "@/actions/documents";
import { requireStep } from "@/lib/step-protection";

export default async function DocumentsPage() {
    // Require Step 3 (Evrak) to access this page
    await requireStep(3);

    // Fetch user phone to check if we need to show verification modal
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const { auth } = await import("@/auth");

    const session = await auth();
    const user = await db.query.users.findFirst({
        where: eq(users.id, session?.user?.id as string),
        columns: { phone: true }
    });

    const docs = await getDocuments();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Evrak Yönetimi</h1>
                <p className="text-gray-500">Başvurunuzun tamamlanması için aşağıdaki belgeleri yükleyiniz.</p>
            </div>

            <div className="bg-orange-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold">Önemli Bilgilendirme</p>
                    <p>Belgeleriniz <strong>PDF, JPEG veya PNG</strong> formatında ve maksimum <strong>5MB</strong> boyutunda olmalıdır. Yüklenen belgeler danışmanlarımız tarafından 24 saat içinde incelenecektir.</p>
                </div>
            </div>

            <DocumentUploadList initialDocuments={docs} userPhone={user?.phone || null} />
        </div>
    );
}
