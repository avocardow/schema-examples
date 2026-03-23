// pinned_messages: Messages pinned to conversations for quick reference.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  conversationId: v.id("conversations"),
  messageId: v.id("messages"),
  pinnedBy: v.id("users"),
  pinnedAt: v.number(),
})
  .index("by_conversation_id_and_pinned_at", ["conversationId", "pinnedAt"])
  .index("by_conversation_id_and_message_id", ["conversationId", "messageId"]);
