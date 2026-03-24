// taskViews: saved view configurations for displaying and filtering tasks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskViews = defineTable({
  projectId: v.id("projects"),
  createdBy: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  layout: v.union(
    v.literal("list"),
    v.literal("board"),
    v.literal("calendar"),
    v.literal("timeline")
  ),
  filters: v.optional(v.any()),
  sortBy: v.optional(v.any()),
  groupBy: v.optional(v.string()),
  isShared: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_project_id_position", ["projectId", "position"])
  .index("by_created_by", ["createdBy"]);
