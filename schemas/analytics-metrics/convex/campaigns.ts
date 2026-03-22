// campaigns: UTM campaign tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaigns = defineTable({
  name: v.string(),
  source: v.string(),
  medium: v.string(),
  term: v.optional(v.string()),
  content: v.optional(v.string()),
  landingUrl: v.optional(v.string()),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_source_medium_name", ["source", "medium", "name"])
  .index("by_is_active", ["isActive"])
  .index("by_created_by", ["createdBy"]);
