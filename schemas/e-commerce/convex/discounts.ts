// discounts: Promotional codes and automatic discounts with usage limits and scheduling.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const discounts = defineTable({
  code: v.optional(v.string()),
  type: v.union(
    v.literal("percentage"),
    v.literal("fixed_amount"),
    v.literal("free_shipping")
  ),
  value: v.number(),
  currency: v.optional(v.string()),
  conditions: v.optional(v.any()),
  usageLimit: v.optional(v.number()),
  usageCount: v.number(),
  perCustomerLimit: v.optional(v.number()),
  startsAt: v.optional(v.number()),
  endsAt: v.optional(v.number()),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_type", ["type"])
  .index("by_isActive_startsAt_endsAt", ["isActive", "startsAt", "endsAt"]);
