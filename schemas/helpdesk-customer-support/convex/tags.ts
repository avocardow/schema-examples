// tags: freeform labels that can be attached to tickets for filtering and reporting.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tags = defineTable({
  name: v.string(),
  color: v.optional(v.string()),
})
  .index("by_name", ["name"]);
