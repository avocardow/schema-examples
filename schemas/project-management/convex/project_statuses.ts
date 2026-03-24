// projectStatuses: workflow statuses configured per project for task tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projectStatuses = defineTable({
  projectId: v.id("projects"),
  name: v.string(),
  color: v.optional(v.string()),
  category: v.union(
    v.literal("backlog"),
    v.literal("unstarted"),
    v.literal("started"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  position: v.number(),
  isDefault: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_project_id_position", ["projectId", "position"])
  .index("by_project_id_category", ["projectId", "category"]);
