// order_items: individual line items within a ticket order.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const order_items = defineTable({
  orderId: v.id("orders"),
  ticketTypeId: v.optional(v.id("ticket_types")),
  ticketTypeName: v.string(),
  unitPrice: v.int64(),
  quantity: v.number(),
  subtotal: v.int64(),
  currency: v.string(),
})
  .index("by_order_id", ["orderId"])
  .index("by_ticket_type_id", ["ticketTypeId"]);
