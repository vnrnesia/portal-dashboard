import { getDocuments } from "@/actions/documents";
import ApplicationStatusClient from "./ApplicationStatusClient";

export default async function ApplicationStatusPage() {
    // Fetch documents on the server
    const docs = await getDocuments();
    const invitationLetter = docs.find(doc => doc.type === "invitation_letter") || null;

    return (
        <ApplicationStatusClient
            invitationLetter={invitationLetter ? {
                fileName: invitationLetter.fileName || "Davet Mektubu",
                fileUrl: invitationLetter.fileUrl || "#"
            } : null}
        />
    );
}

