// post_media: media attachments linked to posts with ordering and dimensions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postMedia = defineTable({
  postId: v.id("posts"),
  fileId: v.id("files"),
  mediaType: v.union(v.literal("image"), v.literal("video"), v.literal("gif")),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  altText: v.optional(v.string()),
  position: v.number(),
})
  .index("by_post_id_position", ["postId", "position"])
  .index("by_file_id", ["fileId"]);
