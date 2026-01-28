import { auth } from "@/auth";
import { getDocuments } from "@/actions/documents";
import { requireStep } from "@/lib/step-protection";
import TranslationUploadClient from "./TranslationUploadClient";

export default async function TranslationPage() {
    // Require Step 4 to access this page
    await requireStep(4);

    const session = await auth();
    const docs = await getDocuments();

    // Filter only translation documents
    const translationDocs = docs.filter(d =>
        d.type === "passport_translation" ||
        d.type === "diploma_translation" ||
        d.type === "transcript_translation"
    );

    return (
        <TranslationUploadClient
            initialDocuments={translationDocs}
            userName={session?.user?.name || ""}
        />
    );
}
