// meal_plan_entries: Individual meals slotted into a meal plan by date and type.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealPlanEntries = defineTable({
  mealPlanId: v.id("meal_plans"),
  recipeId: v.id("recipes"),
  planDate: v.string(),
  mealType: v.union(
    v.literal("breakfast"),
    v.literal("lunch"),
    v.literal("dinner"),
    v.literal("snack")
  ),
  servings: v.optional(v.number()),
  note: v.optional(v.string()),
})
  .index("by_meal_plan_id_and_plan_date", ["mealPlanId", "planDate"])
  .index("by_recipe_id", ["recipeId"]);
