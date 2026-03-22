// product_tag_assignments: Junction table associating products with tags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productTagAssignments = defineTable({
  productId: v.id("products"),
  tagId: v.id("product_tags"),
})
  .index("by_product_id_tag_id", ["productId", "tagId"])
  .index("by_tag_id", ["tagId"]);
