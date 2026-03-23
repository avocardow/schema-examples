// conversation_participants: Membership records linking users to conversations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationParticipants = defineTable({
  conversationId: v.id("conversations"),
  userId: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("moderator"),
    v.literal("member")
  ),
  lastReadAt: v.optional(v.number()),
  notificationLevel: v.optional(
    v.union(v.literal("all"), v.literal("mentions"), v.literal("none"))
  ),
  isMuted: v.boolean(),
  mutedUntil: v.optional(v.number()),
  joinedAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_conversation_id_and_user_id", ["conversationId", "userId"])
  .index("by_user_id", ["userId"])
  .index("by_user_id_and_last_read_at", ["userId", "lastReadAt"]);
