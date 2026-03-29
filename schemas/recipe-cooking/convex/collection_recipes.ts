// collection_recipes: Join table linking recipes into collections with ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const collectionRecipes = defineTable({
  collectionId: v.id("collections"),
  recipeId: v.id("recipes"),
  position: v.number(),
  addedAt: v.number(),
})
  .index("by_collection_id_and_recipe_id", ["collectionId", "recipeId"])
  .index("by_recipe_id", ["recipeId"]);
