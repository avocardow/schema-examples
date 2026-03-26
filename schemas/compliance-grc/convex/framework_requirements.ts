// framework_requirements: Individual requirements within a compliance framework.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const frameworkRequirements = defineTable({
  frameworkId: v.id("frameworks"),
  parentId: v.optional(v.id("framework_requirements")),
  identifier: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_framework_id_and_identifier", ["frameworkId", "identifier"])
  .index("by_parent_id", ["parentId"])
  .index("by_sort_order", ["sortOrder"]);
