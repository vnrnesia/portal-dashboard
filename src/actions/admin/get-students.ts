"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function getStudents() {
    const session = await auth();

    // Security Check
    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const students = await db.query.users.findMany({
        where: eq(users.role, "student"),
        orderBy: [desc(users.createdAt)],
    });

    return students;
}
