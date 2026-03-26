// tickets: individual admission tickets issued to attendees with unique codes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tickets = defineTable({
  orderItemId: v.id("order_items"),
  eventId: v.id("events"),
  ticketTypeId: v.optional(v.id("ticket_types")),
  holderUserId: v.optional(v.id("users")),
  holderName: v.string(),
  holderEmail: v.string(),
  ticketCode: v.string(),
  status: v.union(
    v.literal("valid"),
    v.literal("used"),
    v.literal("cancelled"),
    v.literal("transferred"),
    v.literal("expired")
  ),
  checkedInAt: v.optional(v.number()),
  cancelledAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_ticket_code", ["ticketCode"])
  .index("by_event_id_status", ["eventId", "status"])
  .index("by_holder_user_id", ["holderUserId"])
  .index("by_holder_email", ["holderEmail"])
  .index("by_order_item_id", ["orderItemId"]);
