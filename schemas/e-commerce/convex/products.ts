// products: Core product catalog with soft-delete support.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const products = defineTable({
  categoryId: v.optional(v.id("categories")),
  brandId: v.optional(v.id("brands")),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
  productType: v.optional(v.string()),
  options: v.optional(v.any()),
  metadata: v.optional(v.any()),
  isFeatured: v.boolean(),
  deletedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_category_id", ["categoryId"])
  .index("by_brand_id", ["brandId"])
  .index("by_status", ["status"])
  .index("by_is_featured", ["isFeatured"])
  .index("by_deleted_at", ["deletedAt"])
  .index("by_slug", ["slug"])
  .index("by_status_deleted_at", ["status", "deletedAt"]);
