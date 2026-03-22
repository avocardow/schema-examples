// return_items: Individual products and quantities within a return authorization.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const returnItems = defineTable({
  returnAuthorizationId: v.id("return_authorizations"),
  orderItemId: v.id("order_items"),
  quantity: v.number(),
  reason: v.optional(v.string()),
  condition: v.optional(
    v.union(
      v.literal("unopened"),
      v.literal("like_new"),
      v.literal("used"),
      v.literal("damaged"),
      v.literal("defective")
    )
  ),
  receivedQuantity: v.number(),
  updatedAt: v.number(),
})
  .index("by_return_authorization_id_order_item_id", ["returnAuthorizationId", "orderItemId"]);
