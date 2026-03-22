// event_types: Registry of known event types.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_types = defineTable({
  name: v.string(),
  category: v.optional(v.string()),
  displayName: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  schema: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_name", ["name"])
  .index("by_category", ["category"])
  .index("by_is_active", ["isActive"]);
