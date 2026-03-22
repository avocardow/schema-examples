// fulfillments: Shipment records tracking delivery status for each order.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fulfillments = defineTable({
  orderId: v.id("orders"),
  providerId: v.optional(v.id("fulfillment_providers")),
  shippingMethodId: v.optional(v.id("shipping_methods")),
  status: v.union(
    v.literal("pending"),
    v.literal("shipped"),
    v.literal("in_transit"),
    v.literal("delivered"),
    v.literal("failed"),
    v.literal("returned")
  ),
  trackingNumber: v.optional(v.string()),
  trackingUrl: v.optional(v.string()),
  carrier: v.optional(v.string()),
  shippedAt: v.optional(v.number()),
  deliveredAt: v.optional(v.number()),
  note: v.optional(v.string()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_order_id", ["orderId"])
  .index("by_provider_id", ["providerId"])
  .index("by_status", ["status"])
  .index("by_tracking_number", ["trackingNumber"]);
