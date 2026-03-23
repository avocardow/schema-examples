// post_revisions: Immutable version history for post content changes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postRevisions = defineTable({
  postId: v.id("posts"),
  revisionNumber: v.number(),
  title: v.string(),
  content: v.optional(v.string()),
  excerpt: v.optional(v.string()),
  createdBy: v.id("users"),
})
  .index("by_post_id_revision_number", ["postId", "revisionNumber"])
  .index("by_post_id_creation_time", ["postId", "_creationTime"]);
