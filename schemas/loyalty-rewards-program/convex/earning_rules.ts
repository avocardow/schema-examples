// earning_rules: Rules defining how members earn points (event type, amount, conditions).
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const earningRules = defineTable({
  programId: v.id("loyalty_programs"),
  name: v.string(),
  description: v.optional(v.string()),
  eventType: v.string(),
  earningType: v.union(
    v.literal("fixed"),
    v.literal("per_currency"),
    v.literal("multiplier")
  ),
  pointsAmount: v.optional(v.number()),
  multiplier: v.optional(v.number()),
  minPurchaseAmount: v.optional(v.number()),
  maxPointsPerEvent: v.optional(v.number()),
  conditions: v.optional(v.any()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_program_id_and_is_active", ["programId", "isActive"])
  .index("by_event_type", ["eventType"]);
