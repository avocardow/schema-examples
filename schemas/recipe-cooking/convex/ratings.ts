// ratings: User scores and optional text reviews for recipes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ratings = defineTable({
  recipeId: v.id("recipes"),
  userId: v.id("users"),
  score: v.number(),
  review: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_recipe_id_and_user_id", ["recipeId", "userId"])
  .index("by_user_id", ["userId"]);
