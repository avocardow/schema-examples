// distribution_targets: per-platform distribution records for podcast shows.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const distribution_targets = defineTable({
  showId: v.id("shows"),
  platform: v.string(),
  externalId: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("active"),
    v.literal("rejected"),
    v.literal("suspended")
  ),
  feedUrlOverride: v.optional(v.string()),
  submittedAt: v.optional(v.number()),
  approvedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_show_id_and_platform", ["showId", "platform"])
  .index("by_status", ["status"]);
