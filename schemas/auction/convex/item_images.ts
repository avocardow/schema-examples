// item_images: Images associated with auction items.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const item_images = defineTable({
  itemId: v.id("items"),
  url: v.string(),
  altText: v.optional(v.string()),
  sortOrder: v.number(),
})
  .index("by_item_id", ["itemId"]);
