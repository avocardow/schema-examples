// custom_domains: Custom vanity domains mapped to tenant organizations with DNS verification and SSL tracking.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const verificationMethodEnum = pgEnum("verification_method", [
  "cname",
  "txt",
]);

export const sslStatusEnum = pgEnum("ssl_status", [
  "pending",
  "active",
  "failed",
  "expired",
]);

export const customDomains = pgTable(
  "custom_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    domain: text("domain").unique().notNull(),
    verificationMethod: verificationMethodEnum("verification_method").notNull().default("cname"),
    verificationToken: text("verification_token").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    sslStatus: sslStatusEnum("ssl_status").notNull().default("pending"),
    sslExpiresAt: timestamp("ssl_expires_at", { withTimezone: true }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_custom_domains_organization_id").on(table.organizationId),
  ]
);
