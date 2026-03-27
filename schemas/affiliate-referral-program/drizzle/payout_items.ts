// payout_items: Line items linking individual commissions to a payout batch.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { payouts } from "./payouts";
import { commissions } from "./commissions";

export const payoutItems = pgTable("payout_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    payoutId: uuid("payout_id").notNull().references(() => payouts.id, { onDelete: "cascade" }),
    commissionId: uuid("commission_id").notNull().references(() => commissions.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }, (table) => [
    unique("uq_payout_items_payout_id_commission_id").on(table.payoutId, table.commissionId),
  ]
);
