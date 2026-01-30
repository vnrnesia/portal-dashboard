"use server";

import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { eq, desc, count, sql, and, gte } from "drizzle-orm";
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

export async function getDashboardStats() {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Get all students
    const allStudents = await db.query.users.findMany({
        where: eq(users.role, "student"),
    });

    // Calculate stats
    const totalStudents = allStudents.length;

    // Step distribution
    const stepDistribution: Record<number, number> = {};
    for (const student of allStudents) {
        const step = student.onboardingStep || 1;
        stepDistribution[step] = (stepDistribution[step] || 0) + 1;
    }

    // Calculate students registered this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newStudentsThisWeek = allStudents.filter(
        s => s.createdAt && new Date(s.createdAt) >= oneWeekAgo
    ).length;

    // Completed students (step 8)
    const completedStudents = allStudents.filter(s => (s.onboardingStep || 1) >= 8).length;

    // Active applications (step 2-7)
    const activeApplications = allStudents.filter(
        s => (s.onboardingStep || 1) >= 2 && (s.onboardingStep || 1) < 8
    ).length;

    // Get pending documents count
    const pendingDocs = await db.query.documents.findMany({
        where: eq(documents.status, "reviewing"),
    });

    return {
        totalStudents,
        activeApplications,
        completedStudents,
        newStudentsThisWeek,
        pendingDocuments: pendingDocs.length,
        stepDistribution,
    };
}
