// payouts: Tracks payment disbursements to affiliates.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { affiliates } from "./affiliates";

export const payoutStatus = pgEnum("payout_status", ["pending", "processing", "completed", "failed", "canceled"]);

export const payouts = pgTable("payouts", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "restrict" }),
    payoutNumber: text("payout_number").notNull().unique(),
    status: payoutStatus("status").notNull().default("pending"),
    currency: text("currency").notNull(),
    amount: integer("amount").notNull(),
    fee: integer("fee").notNull().default(0),
    netAmount: integer("net_amount").notNull(),
    payoutMethod: text("payout_method"),
    providerId: text("provider_id"),
    note: text("note"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_payouts_affiliate_id_status").on(table.affiliateId, table.status),
    index("idx_payouts_status").on(table.status),
    index("idx_payouts_created_at").on(table.createdAt),
  ]
);
