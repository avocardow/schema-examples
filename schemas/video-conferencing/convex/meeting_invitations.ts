// meeting_invitations: invitations sent to users for upcoming meetings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetingInvitations = defineTable({
  meetingId: v.id("meetings"),
  inviterId: v.id("users"),
  inviteeId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("declined"),
    v.literal("tentative")
  ),
  respondedAt: v.optional(v.number()),
  message: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_meeting_id_and_invitee_id", ["meetingId", "inviteeId"])
  .index("by_invitee_id_and_status", ["inviteeId", "status"])
  .index("by_meeting_id_and_status", ["meetingId", "status"]);
