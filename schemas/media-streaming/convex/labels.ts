// labels: record labels that publish and distribute albums.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const labels = defineTable({
  name: v.string(),
  slug: v.string(),
  website: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_name", ["name"]);
