// waiting_room_entries: users waiting to be admitted into a meeting.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const waitingRoomEntries = defineTable({
  meetingId: v.id("meetings"),
  userId: v.optional(v.id("users")),
  displayName: v.string(),
  status: v.union(
    v.literal("waiting"),
    v.literal("admitted"),
    v.literal("rejected")
  ),
  admittedBy: v.optional(v.id("users")),
  respondedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_meeting_id_and_status", ["meetingId", "status"])
  .index("by_meeting_id_and_creation_time", ["meetingId", "_creationTime"]);
