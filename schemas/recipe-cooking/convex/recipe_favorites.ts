// recipe_favorites: Tracks which users have favorited which recipes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeFavorites = defineTable({
  recipeId: v.id("recipes"),
  userId: v.id("users"),
})
  .index("by_recipe_id_and_user_id", ["recipeId", "userId"])
  .index("by_user_id", ["userId"]);
