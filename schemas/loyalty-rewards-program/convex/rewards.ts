// rewards: Catalog of available rewards with points cost and inventory tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rewards = defineTable({
  programId: v.id("loyalty_programs"),
  name: v.string(),
  description: v.optional(v.string()),
  rewardType: v.union(
    v.literal("discount_percentage"),
    v.literal("discount_fixed"),
    v.literal("free_product"),
    v.literal("free_shipping"),
    v.literal("gift_card"),
    v.literal("experience"),
    v.literal("custom")
  ),
  pointsCost: v.number(),
  rewardValue: v.optional(v.number()),
  currency: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  inventory: v.optional(v.number()),
  maxRedemptionsPerMember: v.optional(v.number()),
  isActive: v.boolean(),
  minTierId: v.optional(v.id("tiers")),
  metadata: v.optional(v.any()),
  sortOrder: v.number(),
  validFrom: v.optional(v.number()),
  validUntil: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_program_id_and_is_active", ["programId", "isActive"])
  .index("by_reward_type", ["rewardType"])
  .index("by_min_tier_id", ["minTierId"]);
