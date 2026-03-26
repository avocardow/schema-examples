// vendor_orders: Per-vendor order splits with commission and earning calculations.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorOrders = defineTable({
  orderId: v.id("orders"),
  vendorId: v.id("vendors"),
  vendorOrderNumber: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("processing"),
    v.literal("shipped"),
    v.literal("delivered"),
    v.literal("canceled"),
    v.literal("refunded")
  ),
  currency: v.string(),
  subtotal: v.number(),
  shippingTotal: v.number(),
  taxTotal: v.number(),
  discountTotal: v.number(),
  total: v.number(),
  commissionAmount: v.number(),
  vendorEarning: v.number(),
  note: v.optional(v.string()),
  shippedAt: v.optional(v.number()),
  deliveredAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_order_id", ["orderId"])
  .index("by_vendor_id_status", ["vendorId", "status"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"])
  .index("by_vendor_order_number", ["vendorOrderNumber"]);
