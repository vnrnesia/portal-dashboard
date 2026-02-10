import { getDocuments } from "@/actions/documents";
import ApplicationStatusClient from "./ApplicationStatusClient";
import { auth } from "@/auth";
import { requireStep } from "@/lib/step-protection";

export default async function ApplicationStatusPage() {
    // Require Step 6 (Üniversite Başvurusu) to access this page
    await requireStep(6);

    // Fetch documents on the server
    const docs = await getDocuments();
    const invitationLetter = docs.find(doc => doc.type === "invitation_letter") || null;

    // Get current user step
    const session = await auth();
    const currentStep = (session?.user as any)?.onboardingStep || 1;

    return (
        <ApplicationStatusClient
            invitationLetter={invitationLetter ? {
                fileName: invitationLetter.fileName || "Davet Mektubu",
                fileUrl: invitationLetter.fileUrl || "#"
            } : null}
            currentStep={currentStep}
        />
    );
}

