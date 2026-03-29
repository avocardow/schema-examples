// recipe_images: Photos associated with recipes, with ordering and primary flag.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeImages = defineTable({
  recipeId: v.id("recipes"),
  imageUrl: v.string(),
  caption: v.optional(v.string()),
  isPrimary: v.boolean(),
  position: v.number(),
})
  .index("by_recipe_id_and_position", ["recipeId", "position"]);
