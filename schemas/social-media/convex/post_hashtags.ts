// post_hashtags: junction table linking posts to their hashtags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postHashtags = defineTable({
  postId: v.id("posts"),
  hashtagId: v.id("hashtags"),
})
  .index("by_post_id_hashtag_id", ["postId", "hashtagId"])
  .index("by_hashtag_id_creation_time", ["hashtagId", "_creationTime"]);
