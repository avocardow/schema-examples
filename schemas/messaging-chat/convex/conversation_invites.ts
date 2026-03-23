// conversation_invites: Pending invitations to join private conversations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationInvites = defineTable({
  conversationId: v.id("conversations"),
  inviterId: v.id("users"),
  inviteeId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("declined"),
    v.literal("expired")
  ),
  message: v.optional(v.string()),
  expiresAt: v.optional(v.number()),
  respondedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_invitee_id_status", ["inviteeId", "status"])
  .index("by_conversation_id_status", ["conversationId", "status"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_conversation_id_and_invitee_id_and_status", ["conversationId", "inviteeId", "status"]);
