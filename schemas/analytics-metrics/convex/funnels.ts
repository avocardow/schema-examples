// funnels: Multi-step conversion funnels.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const funnels = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  conversionWindow: v.number(),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_is_active", ["isActive"])
  .index("by_created_by", ["createdBy"]);
