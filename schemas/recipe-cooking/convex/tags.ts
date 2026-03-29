// tags: Reusable labels for categorizing and filtering recipes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tags = defineTable({
  name: v.string(),
})
  .index("by_name", ["name"]);
