// users: Central identity record. One row per human (or anonymous) user.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    email: text("email").unique(), // Always store lowercase. Nullable for anonymous or phone-only users.
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }), // When verification occurred (not just whether it did).
    phone: text("phone").unique(), // E.164 format (e.g., "+15551234567").
    phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
    name: text("name"), // Display name. Not used for auth.
    firstName: text("first_name"),
    lastName: text("last_name"),
    username: text("username").unique(),
    imageUrl: text("image_url"), // Avatar / profile picture URL.

    isAnonymous: boolean("is_anonymous").notNull().default(false), // Guest users that can upgrade to full accounts.

    // Ban = admin decision (ToS violation). Lock = automated (brute-force protection).
    banned: boolean("banned").notNull().default(false),
    bannedReason: text("banned_reason"), // Visible to admins, not the user.
    bannedUntil: timestamp("banned_until", { withTimezone: true }), // NULL = permanent ban.
    locked: boolean("locked").notNull().default(false),
    lockedUntil: timestamp("locked_until", { withTimezone: true }), // Auto-unlock after this time.
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0), // Reset to 0 on successful login. Lock when threshold hit.
    lastFailedLoginAt: timestamp("last_failed_login_at", { withTimezone: true }),

    // Two-tier metadata prevents privilege escalation via client-side manipulation.
    // public: client-readable, server-writable (preferences, theme).
    // private: server-only (Stripe ID, internal notes). Never expose to client.
    publicMetadata: jsonb("public_metadata").default(sql`'{}'`),
    privateMetadata: jsonb("private_metadata").default(sql`'{}'`),

    externalId: text("external_id").unique(), // Link to external system (legacy DB, CRM).
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    lastSignInIp: text("last_sign_in_ip"), // Consider privacy regulations before storing.
    signInCount: integer("sign_in_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    // Soft delete: keeps row for audit trails, but may conflict with GDPR/CCPA hard-delete requirements.
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_users_external_id").on(table.externalId),
    index("idx_users_created_at").on(table.createdAt),
  ]
);
