// order_items: Individual line items within an order, capturing product snapshot and pricing at time of purchase.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { productVariants } from "./product_variants";

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  variantTitle: text("variant_title").notNull(),
  sku: text("sku"),
  imageUrl: text("image_url"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
  discountTotal: integer("discount_total").notNull().default(0),
  taxTotal: integer("tax_total").notNull().default(0),
  total: integer("total").notNull(),
  fulfilledQuantity: integer("fulfilled_quantity").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_order_items_order_id").on(table.orderId),
  index("idx_order_items_variant_id").on(table.variantId),
]);
