// post_reactions: Emoji-style user reactions on posts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postReactions = defineTable({
  postId: v.id("posts"),
  userId: v.id("users"),
  reactionType: v.union(
    v.literal("like"),
    v.literal("love"),
    v.literal("clap"),
    v.literal("insightful"),
    v.literal("bookmark")
  ),
})
  .index("by_post_id_user_id_reaction_type", [
    "postId",
    "userId",
    "reactionType",
  ])
  .index("by_user_id", ["userId"])
  .index("by_post_id_reaction_type", ["postId", "reactionType"]);
