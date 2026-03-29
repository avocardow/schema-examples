// comments: Threaded discussion on assets for collaboration and review.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const comments = defineTable({
  assetId: v.id("assets"),
  parentId: v.optional(v.id("comments")),
  body: v.string(),
  authorId: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_asset_id", ["assetId"])
  .index("by_parent_id", ["parentId"]);
