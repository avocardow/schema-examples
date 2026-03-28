// categories: hierarchical taxonomy for organizing podcast shows and content.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const categories = defineTable({
  name: v.string(),
  slug: v.string(),
  parentId: v.optional(v.id("categories")),
})
  .index("by_slug", ["slug"])
  .index("by_parent_id", ["parentId"]);
