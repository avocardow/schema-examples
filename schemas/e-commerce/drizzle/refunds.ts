// refunds: Records refund requests and outcomes against payments and orders.
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
import { payments } from "./payments";
import { orders } from "./orders";
import { users } from "../../auth-rbac/drizzle/users";

export const refundStatusEnum = pgEnum("refund_status", [
  "pending",
  "succeeded",
  "failed",
]);

export const refunds = pgTable(
  "refunds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "restrict" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    providerId: text("provider_id"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    reason: text("reason"),
    status: refundStatusEnum("status").notNull().default("pending"),
    note: text("note"),
    refundedBy: uuid("refunded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_refunds_payment_id").on(table.paymentId),
    index("idx_refunds_order_id").on(table.orderId),
    index("idx_refunds_status").on(table.status),
  ]
);
