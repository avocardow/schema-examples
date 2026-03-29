// collections: User-curated groups of recipes with optional cover image.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const collections = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  isPublic: v.boolean(),
  recipeCount: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"]);
