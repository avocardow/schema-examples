// items: Auction item listings with condition tracking and seller association.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const items = defineTable({
  sellerId: v.id("users"),
  categoryId: v.optional(v.id("categories")),
  title: v.string(),
  description: v.optional(v.string()),
  condition: v.union(v.literal("new"), v.literal("like_new"), v.literal("excellent"), v.literal("good"), v.literal("fair"), v.literal("poor")),
  conditionNotes: v.optional(v.string()),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_seller_id", ["sellerId"])
  .index("by_category_id", ["categoryId"])
  .index("by_condition", ["condition"]);
