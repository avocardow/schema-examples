// vendor_orders: Per-vendor order splits with financial breakdown and fulfillment tracking.
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
import { orders } from "../../e-commerce/drizzle/orders";
import { vendors } from "./vendors";

export const vendorOrderStatus = pgEnum("vendor_order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "refunded",
]);

export const vendorOrders = pgTable(
  "vendor_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "restrict" }),
    vendorOrderNumber: text("vendor_order_number").unique().notNull(),
    status: vendorOrderStatus("status").notNull().default("pending"),
    currency: text("currency").notNull(),
    subtotal: integer("subtotal").notNull(),
    shippingTotal: integer("shipping_total").notNull().default(0),
    taxTotal: integer("tax_total").notNull().default(0),
    discountTotal: integer("discount_total").notNull().default(0),
    total: integer("total").notNull(),
    commissionAmount: integer("commission_amount").notNull().default(0),
    vendorEarning: integer("vendor_earning").notNull().default(0),
    note: text("note"),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_vendor_orders_order_id").on(table.orderId),
    index("idx_vendor_orders_vendor_id_status").on(
      table.vendorId,
      table.status
    ),
    index("idx_vendor_orders_status").on(table.status),
    index("idx_vendor_orders_created_at").on(table.createdAt),
  ]
);
