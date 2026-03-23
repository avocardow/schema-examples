// post_tags: Many-to-many relationship between posts and tags with ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postTags = defineTable({
  postId: v.id("posts"),
  tagId: v.id("tags"),
  sortOrder: v.number(),
})
  .index("by_post_id_tag_id", ["postId", "tagId"])
  .index("by_tag_id", ["tagId"]);
