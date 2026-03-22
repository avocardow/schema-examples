// payments: Individual payment transactions (authorizations, captures, sales) against an order.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { paymentMethods } from "./payment_methods";

export const paymentType = pgEnum("payment_type", [
  "authorization",
  "capture",
  "sale",
]);

export const paymentTransactionStatus = pgEnum("payment_transaction_status", [
  "pending",
  "succeeded",
  "failed",
  "canceled",
]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    paymentMethodId: uuid("payment_method_id").references(
      () => paymentMethods.id,
      { onDelete: "set null" }
    ),

    provider: text("provider").notNull(),
    providerId: text("provider_id"),
    type: paymentType("type").notNull(),
    status: paymentTransactionStatus("status").notNull().default("pending"),

    currency: text("currency").notNull(),
    amount: integer("amount").notNull(),
    providerFee: integer("provider_fee"),

    metadata: jsonb("metadata"),
    errorMessage: text("error_message"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_payments_order_id").on(table.orderId),
    index("idx_payments_provider_provider_id").on(
      table.provider,
      table.providerId
    ),
    index("idx_payments_status").on(table.status),
  ]
);
