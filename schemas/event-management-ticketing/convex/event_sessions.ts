// event_sessions: individual sessions or talks within a multi-track event.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_sessions = defineTable({
  eventId: v.id("events"),
  venueId: v.optional(v.id("venues")),
  title: v.string(),
  description: v.optional(v.string()),
  startTime: v.number(),
  endTime: v.number(),
  track: v.optional(v.string()),
  maxAttendees: v.optional(v.number()),
  position: v.number(),
  status: v.union(
    v.literal("scheduled"),
    v.literal("cancelled"),
    v.literal("rescheduled")
  ),
  updatedAt: v.number(),
})
  .index("by_event_id_start_time", ["eventId", "startTime"])
  .index("by_event_id_track", ["eventId", "track"])
  .index("by_status", ["status"]);
