// reactions: emoji-style reactions on posts supporting multiple reaction types.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reactions = defineTable({
  postId: v.id("posts"),
  userId: v.id("users"),
  type: v.union(
    v.literal("like"),
    v.literal("love"),
    v.literal("celebrate"),
    v.literal("insightful"),
    v.literal("funny")
  ),
})
  .index("by_post_id_user_id_type", ["postId", "userId", "type"])
  .index("by_user_id", ["userId"]);
