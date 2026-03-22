// product_reviews: Customer ratings and feedback for purchased products.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productReviews = defineTable({
  productId: v.id("products"),
  userId: v.id("users"),
  rating: v.number(),
  title: v.optional(v.string()),
  body: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected")
  ),
  verifiedPurchase: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_product_id_status", ["productId", "status"])
  .index("by_product_id_user_id", ["productId", "userId"])
  .index("by_status", ["status"]);
