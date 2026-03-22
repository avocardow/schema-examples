// fulfillments: Tracks shipment lifecycle from dispatch to delivery for each order.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { fulfillmentProviders } from "./fulfillment_providers";
import { shippingMethods } from "./shipping_methods";
import { users } from "../../auth-rbac/drizzle/users";

export const fulfillmentShipmentStatus = pgEnum(
  "fulfillment_shipment_status",
  ["pending", "shipped", "in_transit", "delivered", "failed", "returned"]
);

export const fulfillments = pgTable(
  "fulfillments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    providerId: uuid("provider_id").references(
      () => fulfillmentProviders.id,
      { onDelete: "set null" }
    ),
    shippingMethodId: uuid("shipping_method_id").references(
      () => shippingMethods.id,
      { onDelete: "set null" }
    ),

    status: fulfillmentShipmentStatus("status")
      .notNull()
      .default("pending"),
    trackingNumber: text("tracking_number"),
    trackingUrl: text("tracking_url"),
    carrier: text("carrier"),

    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    note: text("note"),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_fulfillments_order_id").on(table.orderId),
    index("idx_fulfillments_provider_id").on(table.providerId),
    index("idx_fulfillments_status").on(table.status),
    index("idx_fulfillments_tracking_number").on(table.trackingNumber),
  ]
);
