// orders: Ticket purchase transactions with payment and buyer details.
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
import { events } from "./events";
import { users } from "../../auth-rbac/drizzle/users";
import { promoCodes } from "./promo_codes";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "cancelled",
  "refunded",
]);

export const orderPaymentStatusEnum = pgEnum("order_payment_status", [
  "not_required",
  "pending",
  "paid",
  "refunded",
  "partially_refunded",
  "failed",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    promoCodeId: uuid("promo_code_id").references(() => promoCodes.id, {
      onDelete: "set null",
    }),
    subtotal: integer("subtotal").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    total: integer("total").notNull().default(0),
    currency: text("currency").notNull().default("USD"),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentStatus: orderPaymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),
    paymentMethod: text("payment_method"),
    buyerName: text("buyer_name").notNull(),
    buyerEmail: text("buyer_email").notNull(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_orders_event_id_status").on(table.eventId, table.status),
    index("idx_orders_user_id").on(table.userId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_buyer_email").on(table.buyerEmail),
  ],
);
