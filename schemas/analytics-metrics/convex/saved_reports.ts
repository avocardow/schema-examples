// saved_reports: Saved query configurations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const saved_reports = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  config: v.any(),
  visibility: v.union(v.literal("private"), v.literal("team"), v.literal("public")),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"])
  .index("by_visibility", ["visibility"]);
