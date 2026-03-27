// promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const promotions = defineTable({
  programId: v.id("loyalty_programs"),
  name: v.string(),
  description: v.optional(v.string()),
  promotionType: v.union(v.literal("multiplier"), v.literal("fixed_bonus")),
  multiplier: v.optional(v.number()),
  bonusPoints: v.optional(v.number()),
  eventType: v.optional(v.string()),
  conditions: v.optional(v.any()),
  status: v.union(
    v.literal("scheduled"),
    v.literal("active"),
    v.literal("ended"),
    v.literal("canceled")
  ),
  startsAt: v.number(),
  endsAt: v.number(),
  maxPointsPerMember: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_program_id_and_status", ["programId", "status"])
  .index("by_status", ["status"])
  .index("by_starts_at_and_ends_at", ["startsAt", "endsAt"]);
