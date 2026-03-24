// taskLists: ordered groupings of tasks within a project.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskLists = defineTable({
  projectId: v.id("projects"),
  name: v.string(),
  description: v.optional(v.string()),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_project_id_position", ["projectId", "position"]);
