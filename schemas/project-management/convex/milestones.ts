// milestones: time-boxed goals within a project for tracking progress.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const milestones = defineTable({
  projectId: v.id("projects"),
  name: v.string(),
  description: v.optional(v.string()),
  status: v.union(
    v.literal("planned"),
    v.literal("active"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_project_id_status", ["projectId", "status"])
  .index("by_project_id_position", ["projectId", "position"]);
