// shopping_list_items: Individual items on a shopping list with check-off state.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shoppingListItems = defineTable({
  shoppingListId: v.id("shopping_lists"),
  foodId: v.optional(v.id("foods")),
  recipeId: v.optional(v.id("recipes")),
  quantity: v.optional(v.number()),
  unitId: v.optional(v.id("units")),
  customLabel: v.optional(v.string()),
  checked: v.boolean(),
  position: v.number(),
})
  .index("by_shopping_list_id_and_checked", ["shoppingListId", "checked"])
  .index("by_food_id", ["foodId"]);
