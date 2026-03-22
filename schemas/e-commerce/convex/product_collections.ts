// product_collections: Curated groups of products for merchandising and storefront display.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productCollections = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  sortOrder: v.number(),
  isActive: v.boolean(),
  metadata: v.optional(v.any()),
  publishedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_is_active_sort_order", ["isActive", "sortOrder"]);
