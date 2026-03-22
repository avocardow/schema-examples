// goals: Conversion goals.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const goals = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  goalType: v.union(v.literal("event"), v.literal("page_view"), v.literal("custom")),
  eventTypeId: v.optional(v.id("event_types")),
  urlPattern: v.optional(v.string()),
  value: v.optional(v.number()),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_goal_type", ["goalType"])
  .index("by_event_type_id", ["eventTypeId"])
  .index("by_is_active", ["isActive"])
  .index("by_created_by", ["createdBy"]);
