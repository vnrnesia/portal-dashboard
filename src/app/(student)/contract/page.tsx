import { ContractViewer } from "@/components/documents/ContractViewer";
import { auth } from "@/auth";
import { getDocuments } from "@/actions/documents";
import { getProfile } from "@/actions/profile";
import { requireStep } from "@/lib/step-protection";

export default async function ContractPage() {
    // Require Step 3 to access this page
    await requireStep(3);

    const session = await auth();
    const docs = await getDocuments();
    const profile = await getProfile();

    const signedContract = docs.find(d => d.type === "signed_contract");
    const adminContract = docs.find(d => d.type === "admin_contract");

    return (
        <div>
            <ContractViewer
                userName={session?.user?.name || ""}
                contractDoc={signedContract}
                adminContractDoc={adminContract}
                profileData={{
                    name: profile?.name || null,
                    tcKimlik: profile?.tcKimlik || null,
                    phone: profile?.phone || null,
                    address: profile?.address || null,
                    city: profile?.city || null,
                    country: profile?.country || null,
                }}
            />
        </div>
    );
}
