// product_collection_items: Junction table linking products to collections with ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productCollectionItems = defineTable({
  collectionId: v.id("product_collections"),
  productId: v.id("products"),
  sortOrder: v.number(),
  addedAt: v.number(),
})
  .index("by_collection_id_product_id", ["collectionId", "productId"])
  .index("by_product_id", ["productId"]);
