// post_meta: Extensible key-value metadata for posts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postMeta = defineTable({
  postId: v.id("posts"),
  metaKey: v.string(),
  metaValue: v.optional(v.string()),
})
  .index("by_post_id_meta_key", ["postId", "metaKey"])
  .index("by_meta_key", ["metaKey"]);
