// units: Measurement units for ingredient quantities.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const units = defineTable({
  name: v.string(),
  abbreviation: v.optional(v.string()),
  system: v.optional(
    v.union(v.literal("metric"), v.literal("imperial"), v.literal("universal"))
  ),
})
  .index("by_name", ["name"]);
