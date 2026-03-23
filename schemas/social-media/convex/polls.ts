// polls: user-created polls with multiple options and voting controls.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const polls = defineTable({
  authorId: v.id("users"),
  allowsMultiple: v.boolean(),
  options: v.any(),
  voteCount: v.number(),
  voterCount: v.number(),
  closesAt: v.optional(v.number()),
  isClosed: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_author_id", ["authorId"])
  .index("by_closes_at", ["closesAt"]);
