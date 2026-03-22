// order_status_history: Tracks order status transitions over time.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const orderStatusHistory = defineTable({
  orderId: v.id("orders"),
  fromStatus: v.optional(v.string()),
  toStatus: v.string(),
  changedBy: v.optional(v.id("users")),
  note: v.optional(v.string()),
})
  .index("by_order_id_creation_time", ["orderId", "_creationTime"]);
