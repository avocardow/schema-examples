// show_categories: junction table linking shows to categories, with primary category flag.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const show_categories = defineTable({
  showId: v.id("shows"),
  categoryId: v.id("categories"),
  isPrimary: v.boolean(),
})
  .index("by_show_id_category_id", ["showId", "categoryId"])
  .index("by_category_id", ["categoryId"]);
