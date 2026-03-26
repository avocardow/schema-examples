// vendor_order_items: Line items within a vendor order with commission breakdown.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorOrderItems = defineTable({
  vendorOrderId: v.id("vendor_orders"),
  orderItemId: v.id("order_items"),
  listingVariantId: v.optional(v.id("listing_variants")),
  productName: v.string(),
  variantTitle: v.string(),
  sku: v.optional(v.string()),
  unitPrice: v.number(),
  quantity: v.number(),
  subtotal: v.number(),
  commissionAmount: v.number(),
  vendorEarning: v.number(),
})
  .index("by_vendor_order_id", ["vendorOrderId"])
  .index("by_order_item_id", ["orderItemId"]);
