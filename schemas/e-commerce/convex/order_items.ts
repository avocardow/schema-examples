// orderItems: Individual line items within an order.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const orderItems = defineTable({
  orderId: v.id("orders"),
  variantId: v.optional(v.id("product_variants")),
  productName: v.string(),
  variantTitle: v.string(),
  sku: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  unitPrice: v.number(),
  quantity: v.number(),
  subtotal: v.number(),
  discountTotal: v.number(),
  taxTotal: v.number(),
  total: v.number(),
  fulfilledQuantity: v.number(),
})
  .index("by_order_id", ["orderId"])
  .index("by_variant_id", ["variantId"]);
