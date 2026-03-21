// sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  char,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { mfaFactors } from "./mfa_factors";
import { organizations } from "./organizations";

// Authentication Assurance Level: aal1 = password/OAuth, aal2 = MFA verified, aal3 = hardware key.
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").unique().notNull(), // SHA-256 hash. Never store raw session tokens.

    aal: aalLevel("aal").notNull().default("aal1"),

    mfaFactorId: uuid("mfa_factor_id").references(() => mfaFactors.id, {
      onDelete: "set null",
    }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    countryCode: char("country_code", { length: 2 }), // ISO 3166-1 alpha-2, derived from IP.

    organizationId: uuid("organization_id").references(
      () => organizations.id,
      { onDelete: "set null" }
    ), // Active org context for multi-tenant apps.
    impersonatorId: uuid("impersonator_id").references(() => users.id, {
      onDelete: "set null",
    }), // Set when an admin is impersonating this user.

    tag: text("tag"), // Custom label (e.g., "mobile", "api").
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
    index("idx_sessions_expires_at").on(table.expiresAt),
  ]
);
