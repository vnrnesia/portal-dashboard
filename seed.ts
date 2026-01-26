
import { db } from "./src/db";
import { users } from "./src/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding started...");

    const email = "test@student.com";
    const password = "password123";

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        console.log("Test user already exists. Skipping creation.");
        return;
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
        email,
        password: hashedPassword,
        name: "Test Student",
        role: "student",
    });

    console.log("Created test user:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Seeding completed.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:");
    console.error(err);
    process.exit(1);
});
