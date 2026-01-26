"use server";

import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getStudentDetails(userId: string) {
    const session = await auth();

    // Security Check
    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const student = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!student) return null;

    const studentDocuments = await db.query.documents.findMany({
        where: eq(documents.userId, userId),
    });

    return {
        ...student,
        documents: studentDocuments,
    };
}
