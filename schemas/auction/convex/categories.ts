// categories: Hierarchical classification of auction items with self-referencing parent support.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const categories = defineTable({
  parentId: v.optional(v.id("categories")),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  sortOrder: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_parent_id", ["parentId"])
  .index("by_slug", ["slug"])
  .index("by_sort_order", ["sortOrder"]);
