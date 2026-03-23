// message_mentions: @mentions within messages targeting users or channels.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  messageId: v.id("messages"),
  mentionedUserId: v.optional(v.id("users")),
  mentionType: v.union(v.literal("user"), v.literal("channel"), v.literal("all")),
})
  .index("by_mentioned_user_id", ["mentionedUserId"])
  .index("by_message_id_and_mentioned_user_id_and_mention_type", ["messageId", "mentionedUserId", "mentionType"]);
