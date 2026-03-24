// projects: top-level project containers with metadata and visibility settings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projects = defineTable({
  name: v.string(),
  key: v.string(),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  visibility: v.union(v.literal("public"), v.literal("private")),
  taskCount: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_key", ["key"])
  .index("by_created_by", ["createdBy"]);
