// user_trust_scores: User reputation tracking in the moderation system.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const user_trust_scores = defineTable({
  userId: v.id("users"),

  trustLevel: v.union(
    v.literal("new"),
    v.literal("basic"),
    v.literal("member"),
    v.literal("trusted"),
    v.literal("veteran")
  ),

  trustScore: v.number(),
  totalReportsFiled: v.number(),
  reportsUpheld: v.number(),
  reportsDismissed: v.number(),
  flagAccuracy: v.number(),
  contentViolations: v.number(),

  lastViolationAt: v.optional(v.number()),

  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_trust_level", ["trustLevel"])
  .index("by_trust_score", ["trustScore"]);
