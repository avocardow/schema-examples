// verification_tokens: Unified one-time tokens for email verification, password reset,
// magic links, phone verification, and platform invitations.
// See README.md for full design rationale.

import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tokenTypeEnum = pgEnum("token_type", [
  "email_verification",
  "phone_verification",
  "password_reset",
  "magic_link",
  "invitation", // Platform-level invitations only. Org invitations have their own table.
]);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Nullable: some tokens exist before a user record (e.g., magic link signup).
    tokenHash: text("token_hash").unique().notNull(), // SHA-256 hash. Never store the raw token.
    type: tokenTypeEnum("type").notNull(),
    identifier: text("identifier").notNull(), // Email or phone number this token targets.
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }), // Set when consumed. Prevents replay attacks.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_verification_tokens_identifier_type").on(table.identifier, table.type), // "Find the latest password reset token for this email."
    index("idx_verification_tokens_expires_at").on(table.expiresAt),                   // Cleanup job: delete expired tokens periodically.
  ]
);
