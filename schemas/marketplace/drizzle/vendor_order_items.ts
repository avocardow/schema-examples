// vendor_order_items: Line items within a vendor order, linking to listing variants and commissions.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendorOrders } from "./vendor_orders";
import { orderItems } from "../../e-commerce/drizzle/order_items";
import { listingVariants } from "./listing_variants";

export const vendorOrderItems = pgTable(
  "vendor_order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorOrderId: uuid("vendor_order_id")
      .notNull()
      .references(() => vendorOrders.id, { onDelete: "cascade" }),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    listingVariantId: uuid("listing_variant_id").references(
      () => listingVariants.id,
      { onDelete: "set null" }
    ),
    productName: text("product_name").notNull(),
    variantTitle: text("variant_title").notNull(),
    sku: text("sku"),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: integer("subtotal").notNull(),
    commissionAmount: integer("commission_amount").notNull().default(0),
    vendorEarning: integer("vendor_earning").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_vendor_order_items_vendor_order_id").on(table.vendorOrderId),
    index("idx_vendor_order_items_order_item_id").on(table.orderItemId),
  ]
);
