
import { db } from "../src/db";
import { users, verificationTokens } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function main() {
    console.log("🔍 Testing Database Connection...");

    try {
        const testEmail = `test-${Date.now()}@example.com`;
        console.log(`👤 Attempting to insert test user: ${testEmail}`);

        // Test User Insertion
        await db.insert(users).values({
            name: "Test User",
            email: testEmail,
            password: "hashedpassword123", // Dummy hash
        });
        console.log("✅ User inserted successfully.");

        // Fetch User
        const user = await db.query.users.findFirst({
            where: eq(users.email, testEmail)
        });
        console.log(`✅ User fetched: ${user?.id}`);

        // Test Token Insertion
        console.log("🔑 Attempting to insert verification token...");
        const token = uuidv4();
        await db.insert(verificationTokens).values({
            identifier: testEmail,
            token: token,
            expires: new Date(Date.now() + 3600000),
        });
        console.log("✅ Verification token inserted successfully.");

        // Cleanup
        console.log("🧹 Cleaning up test data...");
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, testEmail));
        await db.delete(users).where(eq(users.email, testEmail));
        console.log("✅ Cleanup complete.");

    } catch (error) {
        console.error("❌ DB TEST FAILED:", error);
    } finally {
        process.exit(0);
    }
}

main();
