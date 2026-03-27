// meeting_chat_messages: in-meeting chat messages between participants.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetingChatMessages = defineTable({
  meetingId: v.id("meetings"),
  senderId: v.optional(v.id("users")),
  recipientId: v.optional(v.id("users")),
  content: v.string(),
})
  .index("by_meeting_id_and_creation_time", ["meetingId", "_creationTime"])
  .index("by_sender_id", ["senderId"]);
