// refunds: Refund records against payments and orders.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const refunds = defineTable({
  paymentId: v.id("payments"),
  orderId: v.id("orders"),
  providerId: v.optional(v.string()),
  amount: v.number(),
  currency: v.string(),
  reason: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("succeeded"),
    v.literal("failed"),
  ),
  note: v.optional(v.string()),
  refundedBy: v.optional(v.id("users")),
})
  .index("by_payment_id", ["paymentId"])
  .index("by_order_id", ["orderId"])
  .index("by_status", ["status"]);
