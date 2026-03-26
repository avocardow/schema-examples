// promo_codes: discount codes applicable to event ticket purchases.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const promo_codes = defineTable({
  eventId: v.id("events"),
  code: v.string(),
  discountType: v.union(
    v.literal("percentage"),
    v.literal("fixed")
  ),
  discountValue: v.int64(),
  currency: v.optional(v.string()),
  maxUses: v.optional(v.number()),
  timesUsed: v.number(),
  maxUsesPerOrder: v.number(),
  validFrom: v.optional(v.number()),
  validUntil: v.optional(v.number()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_event_id_code", ["eventId", "code"])
  .index("by_is_active", ["isActive"]);
