// ticket_types: purchasable ticket tiers for an event with pricing and availability.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_types = defineTable({
  eventId: v.id("events"),
  name: v.string(),
  description: v.optional(v.string()),
  price: v.int64(),
  currency: v.string(),
  quantityTotal: v.optional(v.number()),
  quantitySold: v.number(),
  minPerOrder: v.number(),
  maxPerOrder: v.number(),
  saleStartAt: v.optional(v.number()),
  saleEndAt: v.optional(v.number()),
  isActive: v.boolean(),
  isHidden: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_event_id_position", ["eventId", "position"])
  .index("by_event_id_is_active", ["eventId", "isActive"]);
