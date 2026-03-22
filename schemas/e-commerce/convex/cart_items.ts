// cart_items: Line items within a shopping cart, tracking variant and quantity.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const cartItems = defineTable({
  cartId: v.id("carts"),
  variantId: v.id("product_variants"),
  quantity: v.number(),
  addedAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_cart_id_variant_id", ["cartId", "variantId"]);
