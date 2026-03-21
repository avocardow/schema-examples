// organizations: Top-level tenant / workspace / company for multi-tenant apps.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),
  slug: text("slug").unique().notNull(), // URL-safe identifier (e.g., "acme-corp"). Used in URLs: /orgs/acme-corp.
  logoUrl: text("logo_url"), // Organization logo for branding.

  // External IDs: for linking to external systems (billing, CRM, etc.).
  externalId: text("external_id").unique(), // Your own cross-system reference.
  stripeCustomerId: text("stripe_customer_id").unique(), // Direct Stripe link. Common enough to warrant its own column.

  maxMembers: integer("max_members"), // Plan-based member limit. Null = unlimited. Enforced in your app logic.

  // Two-tier metadata prevents privilege escalation via client-side manipulation.
  // public: client-readable, server-writable. private: server-only (e.g., internal billing notes, feature flags).
  publicMetadata: jsonb("public_metadata").default(sql`'{}'`),
  privateMetadata: jsonb("private_metadata").default(sql`'{}'`),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // Soft delete. Same GDPR considerations as users — see the users table note.
});
