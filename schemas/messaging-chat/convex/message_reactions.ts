// message_reactions: Emoji reactions on messages.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const messageReactions = defineTable({
  messageId: v.id("messages"),
  userId: v.id("users"),
  emoji: v.string(),
}).index("by_message_id_and_user_id_and_emoji", ["messageId", "userId", "emoji"])
  .index("by_user_id", ["userId"]);
