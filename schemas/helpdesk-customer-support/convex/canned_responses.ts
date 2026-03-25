// canned_responses: reusable reply templates for agents, optionally shared and grouped by folder.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const canned_responses = defineTable({
  name: v.string(),
  content: v.string(),
  folder: v.optional(v.string()),
  createdById: v.id("users"),
  isShared: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_folder", ["folder"])
  .index("by_created_by_id", ["createdById"])
  .index("by_is_shared", ["isShared"]);
