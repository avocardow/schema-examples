// product_variants: SKU-level variants with dimensions, weight, and option values.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productVariants = defineTable({
  productId: v.id("products"),
  shippingProfileId: v.optional(v.id("shipping_profiles")),
  sku: v.optional(v.string()),
  barcode: v.optional(v.string()),
  title: v.string(),
  optionValues: v.optional(v.any()),
  weightGrams: v.optional(v.number()),
  heightMm: v.optional(v.number()),
  widthMm: v.optional(v.number()),
  lengthMm: v.optional(v.number()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_product_id", ["productId"])
  .index("by_sku", ["sku"])
  .index("by_barcode", ["barcode"])
  .index("by_shipping_profile_id", ["shippingProfileId"]);
