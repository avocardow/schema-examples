// member_tiers: Assignment of members to tiers with temporal tracking and history.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const memberTiers = defineTable({
  memberId: v.id("loyalty_members"),
  tierId: v.id("tiers"),
  isCurrent: v.boolean(),
  startedAt: v.number(),
  endsAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  qualificationSnapshot: v.optional(v.any()),
  isManual: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_member_id_and_is_current", ["memberId", "isCurrent"])
  .index("by_tier_id", ["tierId"])
  .index("by_ends_at", ["endsAt"]);
