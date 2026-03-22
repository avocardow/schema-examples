// product_images: Images associated with products or specific variants.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productImages = defineTable({
  productId: v.id("products"),
  variantId: v.optional(v.id("product_variants")),
  url: v.string(),
  altText: v.optional(v.string()),
  sortOrder: v.number(),
})
  .index("by_product_id_sort_order", ["productId", "sortOrder"])
  .index("by_variant_id", ["variantId"]);
