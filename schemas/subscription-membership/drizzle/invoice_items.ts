// invoice_items: Individual line items on an invoice.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { invoices } from "./invoices";
import { planPrices } from "./plan_prices";

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    planPriceId: uuid("plan_price_id").references(() => planPrices.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    quantity: integer("quantity").notNull().default(1),
    isProration: boolean("is_proration").notNull().default(false),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_invoice_items_invoice_id").on(table.invoiceId),
    index("idx_invoice_items_plan_price_id").on(table.planPriceId),
  ]
);
