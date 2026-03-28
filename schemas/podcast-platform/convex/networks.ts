// networks: podcast networks that group multiple shows under a single brand.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const networks = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  website: v.optional(v.string()),
  logoFileId: v.optional(v.id("files")),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_name", ["name"]);
