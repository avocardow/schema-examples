// vendors: Registered seller accounts with status lifecycle and verification tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";

export const vendorStatus = pgEnum("vendor_status", [
  "pending",
  "active",
  "suspended",
  "deactivated",
]);

export const verificationStatus = pgEnum("vendor_verification_status", [
  "unverified",
  "pending_review",
  "verified",
  "rejected",
]);

export const vendors = pgTable(
  "vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    status: vendorStatus("status").notNull().default("pending"),
    verificationStatus: verificationStatus("verification_status")
      .notNull()
      .default("unverified"),
    commissionRate: numeric("commission_rate"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    suspendedAt: timestamp("suspended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_vendors_owner_id").on(table.ownerId),
    index("idx_vendors_status").on(table.status),
    index("idx_vendors_verification_status").on(table.verificationStatus),
  ]
);
