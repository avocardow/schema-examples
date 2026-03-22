// experiments: A/B test definitions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const experiments = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  hypothesis: v.optional(v.string()),
  status: v.union(
    v.literal("draft"),
    v.literal("running"),
    v.literal("paused"),
    v.literal("completed"),
  ),
  trafficPercentage: v.number(),
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_created_by", ["createdBy"]);
