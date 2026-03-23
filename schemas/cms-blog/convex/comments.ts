// comments: Threaded reader comments on posts with moderation status.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const comments = defineTable({
  postId: v.id("posts"),
  parentId: v.optional(v.id("comments")),
  authorId: v.optional(v.id("users")),
  authorName: v.string(),
  authorEmail: v.optional(v.string()),
  content: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("spam")
  ),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_post_id_status_creation_time", [
    "postId",
    "status",
    "_creationTime",
  ])
  .index("by_parent_id", ["parentId"])
  .index("by_author_id", ["authorId"]);
