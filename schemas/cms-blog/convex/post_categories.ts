// post_categories: Many-to-many relationship between posts and categories.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postCategories = defineTable({
  postId: v.id("posts"),
  categoryId: v.id("categories"),
})
  .index("by_post_id_category_id", ["postId", "categoryId"])
  .index("by_category_id", ["categoryId"]);
