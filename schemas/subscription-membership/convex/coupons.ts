// coupons: discount definitions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const coupons = defineTable({
  code: v.optional(v.string()),
  name: v.string(),
  discountType: v.union(
    v.literal("percentage"), v.literal("fixed_amount")
  ),
  discountValue: v.number(),
  currency: v.optional(v.string()),
  duration: v.union(
    v.literal("once"), v.literal("repeating"), v.literal("forever")
  ),
  durationInMonths: v.optional(v.number()),
  maxRedemptions: v.optional(v.number()),
  timesRedeemed: v.number(),
  isActive: v.boolean(),
  validFrom: v.optional(v.number()),
  validUntil: v.optional(v.number()),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_is_active", ["isActive"])
  .index("by_provider", ["providerType", "providerId"]);
