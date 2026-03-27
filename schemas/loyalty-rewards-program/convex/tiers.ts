// tiers: Tier/VIP level definitions with qualification thresholds and ordering.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tiers = defineTable({
  programId: v.id("loyalty_programs"),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  position: v.number(),
  qualificationType: v.union(
    v.literal("points_earned"),
    v.literal("amount_spent"),
    v.literal("transaction_count")
  ),
  qualificationValue: v.number(),
  qualificationPeriodDays: v.optional(v.number()),
  retainDays: v.optional(v.number()),
  iconUrl: v.optional(v.string()),
  color: v.optional(v.string()),
  isDefault: v.boolean(),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_program_id_and_slug", ["programId", "slug"])
  .index("by_program_id_and_position", ["programId", "position"])
  .index("by_is_default", ["isDefault"]);
