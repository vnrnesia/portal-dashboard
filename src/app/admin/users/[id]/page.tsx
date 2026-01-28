import { getStudentDetails } from "@/actions/admin/get-student-details";
import { StudentDetailView } from "@/components/admin/StudentDetailView";
import { notFound } from "next/navigation";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 requires awaiting params
    const { id } = await params;

    const student = await getStudentDetails(id);

    if (!student) {
        notFound();
    }

    return <StudentDetailView student={student} />;
}

