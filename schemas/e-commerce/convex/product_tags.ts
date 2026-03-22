// product_tags: Freeform labels for cross-cutting product classification.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const productTags = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
})
  .index("by_slug", ["slug"]);
