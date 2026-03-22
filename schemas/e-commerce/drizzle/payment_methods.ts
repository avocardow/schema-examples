// payment_methods: Stored payment instruments linked to a user for checkout and recurring billing.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const paymentMethodType = pgEnum("payment_method_type", [
  "card",
  "bank_account",
  "paypal",
  "apple_pay",
  "google_pay",
]);

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: paymentMethodType("type").notNull(),
    provider: text("provider").notNull(),
    providerId: text("provider_id").notNull(),

    label: text("label"),
    lastFour: text("last_four"),
    brand: text("brand"),
    expMonth: integer("exp_month"),
    expYear: integer("exp_year"),

    isDefault: boolean("is_default").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_payment_methods_user_id").on(table.userId),
    unique("uq_payment_methods_provider_provider_id").on(table.provider, table.providerId),
  ]
);
