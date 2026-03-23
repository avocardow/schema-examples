// messages: Individual messages within conversations with threading support.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  conversationId: v.id("conversations"),
  senderId: v.optional(v.id("users")),
  content: v.optional(v.string()),
  contentType: v.union(v.literal("text"), v.literal("system"), v.literal("deleted")),
  parentMessageId: v.optional(v.id("messages")),
  replyCount: v.number(),
  lastReplyAt: v.optional(v.number()),
  isEdited: v.boolean(),
  editedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_conversation_id_and_creation_time", ["conversationId", "_creationTime"])
  .index("by_sender_id", ["senderId"])
  .index("by_parent_message_id", ["parentMessageId"])
  .index("by_conversation_id_and_parent_message_id", ["conversationId", "parentMessageId"])
  .index("by_expires_at", ["expiresAt"]);
