import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// Enums
export const roleEnum = pgEnum("role", ["student", "admin"]);
export const docStatusEnum = pgEnum("doc_status", ["pending", "uploaded", "reviewing", "approved", "rejected"]);

// Users Table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"), // Added for credentials login
    role: roleEnum("role").default("student"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Accounts Table (for OAuth)
export const accounts = pgTable(
    "accounts",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

// Sessions Table
export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens Table
export const verificationTokens = pgTable(
    "verificationTokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);


// Programs Table
export const programs = pgTable("programs", {
    id: uuid("id").defaultRandom().primaryKey(),
    university: text("university").notNull(),
    logo: text("logo"),
    name: text("name").notNull(),
    country: text("country"),
    city: text("city"),
    language: text("language"),
    tuition: text("tuition"),
    duration: text("duration"),
    rating: integer("rating"),
    tags: text("tags").array(),
    bgImage: text("bg_image"),

    details: jsonb("details").$type<{
        studentCount: string;
        internationalStudents: string;
        livingCost: string;
        ranking: string;
        locationStats: string;
        description: string;
    }>(),
});

// Applications Table
export const applications = pgTable("applications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    programId: uuid("program_id").references(() => programs.id).notNull(),
    status: text("status").default("pending"),
    appliedAt: timestamp("applied_at").defaultNow(),
});

// Documents Table
export const documents = pgTable("documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    type: text("type").notNull(),
    label: text("label").notNull(),
    status: docStatusEnum("status").default("pending"),
    fileName: text("file_name"),
    fileUrl: text("file_url"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
