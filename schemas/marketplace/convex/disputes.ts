// disputes: Customer-vendor order disputes with resolution workflow.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const disputes = defineTable({
  vendorOrderId: v.id("vendor_orders"),
  customerId: v.id("users"),
  vendorId: v.id("vendors"),
  reason: v.union(
    v.literal("not_received"),
    v.literal("not_as_described"),
    v.literal("defective"),
    v.literal("wrong_item"),
    v.literal("unauthorized"),
    v.literal("other")
  ),
  status: v.union(
    v.literal("open"),
    v.literal("under_review"),
    v.literal("escalated"),
    v.literal("resolved_customer"),
    v.literal("resolved_vendor"),
    v.literal("closed")
  ),
  description: v.string(),
  resolutionNote: v.optional(v.string()),
  refundAmount: v.optional(v.number()),
  currency: v.string(),
  resolvedBy: v.optional(v.id("users")),
  resolvedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_vendor_order_id", ["vendorOrderId"])
  .index("by_customer_id", ["customerId"])
  .index("by_vendor_id_status", ["vendorId", "status"])
  .index("by_status", ["status"]);
