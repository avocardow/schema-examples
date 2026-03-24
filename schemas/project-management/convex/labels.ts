// labels: categorization tags defined per project for organizing tasks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const labels = defineTable({
  projectId: v.id("projects"),
  name: v.string(),
  color: v.optional(v.string()),
  description: v.optional(v.string()),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_project_id_name", ["projectId", "name"]);
