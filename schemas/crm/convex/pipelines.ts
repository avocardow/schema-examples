// pipelines: sales pipelines that organize deal progression.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pipelines = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  isDefault: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_position", ["position"]);
