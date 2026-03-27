// breakout_rooms: sub-rooms within a meeting for smaller group discussions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const breakoutRooms = defineTable({
  meetingId: v.id("meetings"),
  name: v.string(),
  position: v.number(),
  status: v.union(
    v.literal("pending"),
    v.literal("open"),
    v.literal("closed")
  ),
  openedAt: v.optional(v.number()),
  closedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_meeting_id_and_position", ["meetingId", "position"])
  .index("by_meeting_id_and_status", ["meetingId", "status"]);
