// meeting_participants: tracks each user's presence and media state within a meeting.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetingParticipants = defineTable({
  meetingId: v.id("meetings"),
  userId: v.optional(v.id("users")),
  displayName: v.string(),
  role: v.union(
    v.literal("host"),
    v.literal("co_host"),
    v.literal("moderator"),
    v.literal("attendee"),
    v.literal("viewer")
  ),
  joinedAt: v.number(),
  leftAt: v.optional(v.number()),
  durationSeconds: v.optional(v.number()),
  isCameraOn: v.boolean(),
  isMicOn: v.boolean(),
  isScreenSharing: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_meeting_id_and_user_id", ["meetingId", "userId"])
  .index("by_user_id", ["userId"])
  .index("by_meeting_id_and_joined_at", ["meetingId", "joinedAt"]);
