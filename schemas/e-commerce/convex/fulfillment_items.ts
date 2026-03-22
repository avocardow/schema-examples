// fulfillment_items: Line-item quantities included in each fulfillment shipment.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fulfillmentItems = defineTable({
  fulfillmentId: v.id("fulfillments"),
  orderItemId: v.id("order_items"),
  quantity: v.number(),
})
  .index("by_fulfillment_id_order_item_id", ["fulfillmentId", "orderItemId"]);
