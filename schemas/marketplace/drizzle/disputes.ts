// disputes: Customer-vendor order disputes with reason classification and resolution tracking.
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
import { vendorOrders } from "./vendor_orders";
import { users } from "../../auth-rbac/drizzle/users";
import { vendors } from "./vendors";

export const disputeReason = pgEnum("dispute_reason", [
  "not_received",
  "not_as_described",
  "defective",
  "wrong_item",
  "unauthorized",
  "other",
]);

export const disputeStatus = pgEnum("dispute_status", [
  "open",
  "under_review",
  "escalated",
  "resolved_customer",
  "resolved_vendor",
  "closed",
]);

export const disputes = pgTable(
  "disputes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .references(() => vendorOrders.id, { onDelete: "restrict" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "restrict" }),
    reason: disputeReason("reason").notNull(),
    status: disputeStatus("status").notNull().default("open"),
    description: text("description").notNull(),
    resolutionNote: text("resolution_note"),
    refundAmount: integer("refund_amount"),
    currency: text("currency").notNull(),
    resolvedBy: uuid("resolved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_disputes_vendor_order_id").on(table.vendorOrderId),
    index("idx_disputes_customer_id").on(table.customerId),
    index("idx_disputes_vendor_id_status").on(table.vendorId, table.status),
    index("idx_disputes_status").on(table.status),
  ]
);
