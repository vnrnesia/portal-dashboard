import { ContractViewer } from "@/components/documents/ContractViewer";
import { auth } from "@/auth";
import { getDocuments } from "@/actions/documents";
import { requireStep } from "@/lib/step-protection";

export default async function ContractPage() {
    // Require Step 3 to access this page
    await requireStep(3);

    const session = await auth();
    const docs = await getDocuments();

    const signedContract = docs.find(d => d.type === "signed_contract");

    return (
        <div>
            <ContractViewer
                userName={session?.user?.name || ""}
                contractDoc={signedContract}
            />
        </div>
    );
}

