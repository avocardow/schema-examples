// deal_activities: append-only audit trail of deal changes for pipeline analytics.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const dealActivities = defineTable({
  dealId: v.id("deals"),
  userId: v.optional(v.id("users")),
  action: v.union(
    v.literal("created"),
    v.literal("updated"),
    v.literal("stage_changed"),
    v.literal("won"),
    v.literal("lost"),
    v.literal("reopened")
  ),
  field: v.optional(v.string()),
  oldValue: v.optional(v.string()),
  newValue: v.optional(v.string()),
})
  .index("by_deal_id_and_creation_time", ["dealId"])
  .index("by_user_id", ["userId"]);
