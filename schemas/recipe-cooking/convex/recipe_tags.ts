// recipe_tags: Many-to-many join linking recipes to tags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeTags = defineTable({
  recipeId: v.id("recipes"),
  tagId: v.id("tags"),
})
  .index("by_recipe_id_and_tag_id", ["recipeId", "tagId"])
  .index("by_tag_id", ["tagId"]);
