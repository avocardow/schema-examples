// dashboards: Dashboard containers.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const dashboards = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  layout: v.optional(v.any()),
  visibility: v.union(v.literal("private"), v.literal("team"), v.literal("public")),
  isDefault: v.boolean(),
  refreshInterval: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"])
  .index("by_visibility", ["visibility"])
  .index("by_is_default", ["isDefault"]);
