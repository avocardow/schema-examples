// wishlist_items: Individual product variants saved to a wishlist.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const wishlistItems = defineTable({
  wishlistId: v.id("wishlists"),
  variantId: v.id("product_variants"),
  addedAt: v.number(),
})
  .index("by_wishlist_id_variant_id", ["wishlistId", "variantId"]);
