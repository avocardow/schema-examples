// bookmarks: saved posts for users to revisit later.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookmarks = defineTable({
  userId: v.id("users"),
  postId: v.id("posts"),
})
  .index("by_user_id_post_id", ["userId", "postId"])
  .index("by_user_id_creation_time", ["userId", "_creationTime"]);
