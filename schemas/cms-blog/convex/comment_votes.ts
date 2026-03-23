// comment_votes: User upvotes and downvotes on comments.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const commentVotes = defineTable({
  commentId: v.id("comments"),
  userId: v.id("users"),
  value: v.number(),
})
  .index("by_comment_id_user_id", ["commentId", "userId"])
  .index("by_user_id", ["userId"]);
