// reposts: tracks when users repost content to their followers.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reposts = defineTable({
  postId: v.id("posts"),
  userId: v.id("users"),
})
  .index("by_post_id_user_id", ["postId", "userId"])
  .index("by_user_id_creation_time", ["userId", "_creationTime"]);
