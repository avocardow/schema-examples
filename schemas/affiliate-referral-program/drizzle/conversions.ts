// conversions: Tracks completed conversion events tied to referrals and affiliates.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { referrals } from "./referrals";
import { affiliates } from "./affiliates";

export const conversionStatus = pgEnum("conversion_status", ["pending", "approved", "rejected", "reversed"]);

export const conversions = pgTable("conversions", {
    id: uuid("id").primaryKey().defaultRandom(),
    referralId: uuid("referral_id").notNull().references(() => referrals.id, { onDelete: "restrict" }),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "restrict" }),
    externalId: text("external_id"),
    referenceType: text("reference_type"),
    amount: integer("amount").notNull().default(0),
    currency: text("currency").notNull(),
    status: conversionStatus("status").notNull().default("pending"),
    metadata: jsonb("metadata"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_conversions_referral_id").on(table.referralId),
    index("idx_conversions_affiliate_id_status").on(table.affiliateId, table.status),
    index("idx_conversions_external_id").on(table.externalId),
    index("idx_conversions_status").on(table.status),
    index("idx_conversions_created_at").on(table.createdAt),
  ]
);
