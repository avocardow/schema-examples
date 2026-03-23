// categories: Hierarchical content classification with materialized path.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const categories = defineTable({
  parentId: v.optional(v.id("categories")),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  path: v.string(),
  depth: v.number(),
  sortOrder: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_parent_id", ["parentId"])
  .index("by_path", ["path"])
  .index("by_is_active_sort_order", ["isActive", "sortOrder"]);
