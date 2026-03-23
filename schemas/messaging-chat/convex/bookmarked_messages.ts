// bookmarked_messages: Per-user saved messages for quick reference.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookmarked_messages = defineTable({
  userId: v.id("users"),
  messageId: v.id("messages"),
  note: v.optional(v.string()),
})
  .index("by_user_id_and_creation_time", ["userId", "_creationTime"])
  .index("by_user_id_and_message_id", ["userId", "messageId"]);
