// mentions: tracks user mentions within posts for notifications and lookups.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mentions = defineTable({
  postId: v.id("posts"),
  mentionedUserId: v.id("users"),
})
  .index("by_post_id_mentioned_user_id", ["postId", "mentionedUserId"])
  .index("by_mentioned_user_id_creation_time", ["mentionedUserId", "_creationTime"]);
