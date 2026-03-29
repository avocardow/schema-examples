// recipe_ingredients: Links recipes to foods with quantity, unit, and ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeIngredients = defineTable({
  recipeId: v.id("recipes"),
  foodId: v.id("foods"),
  unitId: v.optional(v.id("units")),
  quantity: v.optional(v.number()),
  note: v.optional(v.string()),
  sectionLabel: v.optional(v.string()),
  position: v.number(),
  optional: v.boolean(),
})
  .index("by_recipe_id_and_position", ["recipeId", "position"])
  .index("by_food_id", ["foodId"]);
