// tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tierBenefits = defineTable({
  tierId: v.id("tiers"),
  benefitType: v.union(
    v.literal("points_multiplier"),
    v.literal("free_shipping"),
    v.literal("early_access"),
    v.literal("birthday_bonus"),
    v.literal("exclusive_rewards"),
    v.literal("priority_support"),
    v.literal("custom")
  ),
  value: v.optional(v.string()),
  description: v.string(),
  isActive: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_tier_id", ["tierId"])
  .index("by_benefit_type", ["benefitType"]);
