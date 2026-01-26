import { ContractViewer } from "@/components/documents/ContractViewer";
import { auth } from "@/auth";
import { getDocuments } from "@/actions/documents";

export default async function ContractPage() {
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
