// vendor_reviews: Customer ratings and feedback for vendor service quality.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorReviews = defineTable({
  vendorId: v.id("vendors"),
  customerId: v.id("users"),
  vendorOrderId: v.optional(v.id("vendor_orders")),
  rating: v.number(),
  title: v.optional(v.string()),
  body: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected")
  ),
  updatedAt: v.number(),
})
  .index("by_vendor_id_status", ["vendorId", "status"])
  .index("by_vendor_id_customer_id_order_id", ["vendorId", "customerId", "vendorOrderId"])
  .index("by_status", ["status"]);
