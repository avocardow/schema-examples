// recipe_instructions: Step-by-step preparation instructions for each recipe.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeInstructions = defineTable({
  recipeId: v.id("recipes"),
  stepNumber: v.number(),
  instruction: v.string(),
  sectionLabel: v.optional(v.string()),
  timeMinutes: v.optional(v.number()),
})
  .index("by_recipe_id_and_step_number", ["recipeId", "stepNumber"]);
