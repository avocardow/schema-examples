// listing_variants: Per-variant pricing and stock for marketplace listings.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const listingVariants = defineTable({
  listingId: v.id("listings"),
  variantId: v.id("product_variants"),
  price: v.number(),
  currency: v.string(),
  salePrice: v.optional(v.number()),
  stockQuantity: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_listing_id_variant_id", ["listingId", "variantId"])
  .index("by_variant_id_is_active", ["variantId", "isActive"]);
