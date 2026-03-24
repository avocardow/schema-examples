// service_categories: hierarchical groupings for organizing bookable services.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const serviceCategories = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  parentId: v.optional(v.id("service_categories")),
  position: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_parent_id", ["parentId"])
  .index("by_is_active_position", ["isActive", "position"])
  .index("by_slug", ["slug"]);
