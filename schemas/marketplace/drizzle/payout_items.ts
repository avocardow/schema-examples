// payout_items: Individual vendor order amounts included in a payout batch.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { payouts } from "./payouts";
import { vendorOrders } from "./vendor_orders";

export const payoutItems = pgTable(
  "payout_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payoutId: uuid("payout_id")
      .notNull()
      .references(() => payouts.id, { onDelete: "cascade" }),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .references(() => vendorOrders.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    commission: integer("commission").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_payout_items_payout_id").on(table.payoutId),
    unique("idx_payout_items_payout_id_vendor_order_id").on(
      table.payoutId,
      table.vendorOrderId
    ),
  ]
);
