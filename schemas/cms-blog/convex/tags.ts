// tags: Flat content labels for flexible post classification.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tags = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_is_active", ["isActive"]);
