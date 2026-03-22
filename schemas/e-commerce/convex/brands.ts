// brands: Manufacturer or label identity for product attribution and storefront filtering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const brands = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_active_sort", ["isActive", "sortOrder"]);
