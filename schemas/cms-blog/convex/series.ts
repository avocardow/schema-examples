// series: Ordered collections of related posts for multi-part content.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const series = defineTable({
  title: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_is_active", ["isActive"]);
