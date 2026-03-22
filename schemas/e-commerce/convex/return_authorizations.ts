// return_authorizations: RMA requests tracking return approval and refund workflow.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const returnAuthorizations = defineTable({
  orderId: v.id("orders"),
  rmaNumber: v.string(),
  status: v.union(
    v.literal("requested"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("received"),
    v.literal("refunded"),
    v.literal("canceled")
  ),
  reason: v.optional(v.string()),
  note: v.optional(v.string()),
  refundAmount: v.optional(v.number()),
  currency: v.string(),
  requestedBy: v.optional(v.id("users")),
  approvedBy: v.optional(v.id("users")),
  receivedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_order_id", ["orderId"])
  .index("by_rma_number", ["rmaNumber"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"]);
