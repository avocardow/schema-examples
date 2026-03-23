// posts: primary content entries supporting text, replies, quotes, and visibility controls.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const posts = defineTable({
  authorId: v.id("users"),
  content: v.optional(v.string()),
  contentType: v.union(v.literal("text"), v.literal("system"), v.literal("deleted")),
  replyToId: v.optional(v.id("posts")),
  conversationId: v.optional(v.id("posts")),
  quoteOfId: v.optional(v.id("posts")),
  visibility: v.union(
    v.literal("public"),
    v.literal("unlisted"),
    v.literal("followers_only"),
    v.literal("mentioned_only")
  ),
  isEdited: v.boolean(),
  editedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  replyCount: v.number(),
  reactionCount: v.number(),
  repostCount: v.number(),
  pollId: v.optional(v.id("polls")),
  updatedAt: v.number(),
})
  .index("by_author_id_creation_time", ["authorId", "_creationTime"])
  .index("by_reply_to_id", ["replyToId"])
  .index("by_conversation_id_creation_time", ["conversationId", "_creationTime"])
  .index("by_visibility_creation_time", ["visibility", "_creationTime"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_quote_of_id", ["quoteOfId"]);
