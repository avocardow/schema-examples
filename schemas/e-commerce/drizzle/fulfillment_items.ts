// fulfillment_items: Line items included in a fulfillment shipment, with quantities.
// See README.md for full design rationale.
import { pgTable, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { fulfillments } from "./fulfillments";
import { orderItems } from "./order_items";

export const fulfillmentItems = pgTable("fulfillment_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  fulfillmentId: uuid("fulfillment_id").notNull().references(() => fulfillments.id, { onDelete: "cascade" }),
  orderItemId: uuid("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_fulfillment_items_fulfillment_order_item").on(table.fulfillmentId, table.orderItemId),
]);
