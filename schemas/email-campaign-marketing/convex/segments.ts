// segments: Dynamic contact groups defined by filter criteria.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const segments = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  filterCriteria: v.any(),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"]);
