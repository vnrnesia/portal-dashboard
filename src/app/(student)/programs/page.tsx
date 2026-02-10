import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProgramsClient from "./ProgramsClient";
import { Program } from "@/lib/data/programs";
import { requireStep } from "@/lib/step-protection";

export default async function ProgramsPage() {
    // Require Step 1+ (accessible right after registration)
    await requireStep(1);

    const session = await auth();
    let selectedProgram: Program | null = null;

    if (session?.user?.id) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                selectedProgram: true
            }
        });

        if (user?.selectedProgram) {
            selectedProgram = user.selectedProgram as Program;
        }
    }

    return <ProgramsClient selectedProgram={selectedProgram} />;
}
