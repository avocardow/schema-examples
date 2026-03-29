// recipe_nutrition: Per-recipe nutritional breakdown (one-to-one with recipes).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeNutrition = defineTable({
  recipeId: v.id("recipes"),
  calories: v.optional(v.number()),
  totalFatGrams: v.optional(v.number()),
  saturatedFatGrams: v.optional(v.number()),
  carbohydratesGrams: v.optional(v.number()),
  fiberGrams: v.optional(v.number()),
  sugarGrams: v.optional(v.number()),
  proteinGrams: v.optional(v.number()),
  sodiumMg: v.optional(v.number()),
  cholesterolMg: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_recipe_id", ["recipeId"]);
