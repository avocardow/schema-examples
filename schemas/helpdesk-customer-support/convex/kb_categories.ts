// kb_categories: hierarchical sections for organizing knowledge base articles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const kb_categories = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  parentId: v.optional(v.id("kb_categories")),
  sortOrder: v.number(),
  isPublished: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_parent_id_and_sort_order", ["parentId", "sortOrder"]);
