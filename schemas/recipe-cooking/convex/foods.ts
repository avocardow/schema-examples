// foods: Canonical ingredient names used across recipes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const foods = defineTable({
  name: v.string(),
  category: v.optional(v.string()),
})
  .index("by_name", ["name"])
  .index("by_category", ["category"]);
