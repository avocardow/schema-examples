// orders: Customer purchase records with shipping, billing, and fulfillment tracking.
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
import { users } from "../../auth-rbac/drizzle/users";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "refunded",
]);

export const paymentStatus = pgEnum("payment_status", [
  "unpaid",
  "partially_paid",
  "paid",
  "partially_refunded",
  "refunded",
]);

export const fulfillmentStatus = pgEnum("fulfillment_status", [
  "unfulfilled",
  "partially_fulfilled",
  "fulfilled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderNumber: text("order_number").unique().notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    email: text("email").notNull(),

    status: orderStatus("status").notNull().default("pending"),
    currency: text("currency").notNull(), // ISO 4217 code (e.g., "USD").
    subtotal: integer("subtotal").notNull(), // All monetary values in smallest currency unit (cents).
    discountTotal: integer("discount_total").notNull().default(0),
    taxTotal: integer("tax_total").notNull().default(0),
    shippingTotal: integer("shipping_total").notNull().default(0),
    grandTotal: integer("grand_total").notNull(),

    paymentStatus: paymentStatus("payment_status")
      .notNull()
      .default("unpaid"),
    fulfillmentStatus: fulfillmentStatus("fulfillment_status")
      .notNull()
      .default("unfulfilled"),

    // Shipping address
    shippingName: text("shipping_name"),
    shippingAddressLine1: text("shipping_address_line1"),
    shippingAddressLine2: text("shipping_address_line2"),
    shippingCity: text("shipping_city"),
    shippingRegion: text("shipping_region"),
    shippingPostalCode: text("shipping_postal_code"),
    shippingCountry: text("shipping_country"),
    shippingPhone: text("shipping_phone"),

    // Billing address
    billingName: text("billing_name"),
    billingAddressLine1: text("billing_address_line1"),
    billingAddressLine2: text("billing_address_line2"),
    billingCity: text("billing_city"),
    billingRegion: text("billing_region"),
    billingPostalCode: text("billing_postal_code"),
    billingCountry: text("billing_country"),

    discountCode: text("discount_code"),
    note: text("note"),

    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_orders_user_id").on(table.userId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_payment_status").on(table.paymentStatus),
    index("idx_orders_fulfillment_status").on(table.fulfillmentStatus),
    index("idx_orders_created_at").on(table.createdAt),
  ]
);
