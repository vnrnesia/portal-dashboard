
import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function reset() {
    console.log("🗑️ Veritabanı sıfırlanıyor (Tablolar siliniyor)...");
    try {
        // Drop public schema and recreate it to wipe all tables and constrains
        await db.execute(sql`DROP SCHEMA public CASCADE;`);
        await db.execute(sql`CREATE SCHEMA public;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
        console.log("✅ Veritabanı başarıyla sıfırlandı.");
    } catch (e) {
        console.error("❌ Sıfırlama hatası:", e);
    } finally {
        process.exit(0);
    }
}

reset();
