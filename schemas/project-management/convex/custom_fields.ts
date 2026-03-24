// customFields: user-defined fields extending the task schema per project.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFields = defineTable({
  projectId: v.id("projects"),
  name: v.string(),
  fieldType: v.union(
    v.literal("text"),
    v.literal("number"),
    v.literal("date"),
    v.literal("select"),
    v.literal("multi_select"),
    v.literal("checkbox"),
    v.literal("url")
  ),
  description: v.optional(v.string()),
  isRequired: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_project_id_position", ["projectId", "position"]);
