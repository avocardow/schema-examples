// payment_methods: Stored payment instruments linked to a customer.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const paymentMethodTypeEnum = pgEnum("payment_method_type", [
  "card",
  "bank_account",
  "paypal",
  "sepa_debit",
  "ideal",
  "other",
]);

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    type: paymentMethodTypeEnum("type").notNull(),
    cardBrand: text("card_brand"),
    cardLast4: text("card_last4"),
    cardExpMonth: integer("card_exp_month"),
    cardExpYear: integer("card_exp_year"),
    isDefault: boolean("is_default").notNull().default(false),
    providerType: text("provider_type"),
    providerId: text("provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_payment_methods_customer_id").on(table.customerId),
    index("idx_payment_methods_provider").on(table.providerType, table.providerId),
  ]
);
