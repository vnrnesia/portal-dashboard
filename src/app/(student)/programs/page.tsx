import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProgramsClient from "./ProgramsClient";
import { Program } from "@/lib/data/programs";

export default async function ProgramsPage() {
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
