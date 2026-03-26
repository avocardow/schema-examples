// payouts: Scheduled vendor payment disbursements with status and period tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";

export const payoutStatus = pgEnum("payout_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "canceled",
]);

export const payouts = pgTable(
  "payouts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "restrict" }),
    payoutNumber: text("payout_number").unique().notNull(),
    status: payoutStatus("status").notNull().default("pending"),
    currency: text("currency").notNull(),
    amount: integer("amount").notNull(),
    fee: integer("fee").notNull().default(0),
    netAmount: integer("net_amount").notNull(),
    provider: text("provider"),
    providerId: text("provider_id"),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    note: text("note"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_payouts_vendor_id_status").on(table.vendorId, table.status),
    index("idx_payouts_status").on(table.status),
    index("idx_payouts_period_start_period_end").on(
      table.periodStart,
      table.periodEnd
    ),
  ]
);
