// ticket_categories: hierarchical classification for tickets with optional parent nesting.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_categories = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  parentId: v.optional(v.id("ticket_categories")),
  sortOrder: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_parent_id_and_sort_order", ["parentId", "sortOrder"]);
