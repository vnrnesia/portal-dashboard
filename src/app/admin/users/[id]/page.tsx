import { getStudentDetails } from "@/actions/admin/get-student-details";
import { StudentDetailView } from "@/components/admin/StudentDetailView";
import { notFound } from "next/navigation";

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    // Resolve params for Next.js 15+ compatibility if needed, or structured access
    const { id } = params;

    const student = await getStudentDetails(id);

    if (!student) {
        notFound();
    }

    return <StudentDetailView student={student} />;
}
