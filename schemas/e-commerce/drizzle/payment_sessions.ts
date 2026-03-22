// payment_sessions: Tracks payment attempts and provider state for each cart checkout.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { carts } from "./carts";

export const paymentSessionStatusEnum = pgEnum("payment_session_status", [
  "pending",
  "authorized",
  "requires_action",
  "completed",
  "canceled",
  "error",
]);

export const paymentSessions = pgTable(
  "payment_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerId: text("provider_id"),
    status: paymentSessionStatusEnum("status").notNull().default("pending"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    data: jsonb("data"),
    isSelected: boolean("is_selected").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_payment_sessions_cart_id").on(table.cartId),
    index("idx_payment_sessions_provider_provider_id").on(
      table.provider,
      table.providerId
    ),
    index("idx_payment_sessions_status").on(table.status),
  ]
);
