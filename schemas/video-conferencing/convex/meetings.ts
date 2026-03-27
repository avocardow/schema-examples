// meetings: scheduled or ad-hoc video conferencing sessions held within a room.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const meetings = defineTable({
  roomId: v.id("rooms"),
  title: v.optional(v.string()),
  status: v.union(
    v.literal("scheduled"),
    v.literal("live"),
    v.literal("ended"),
    v.literal("cancelled")
  ),
  scheduledStart: v.optional(v.number()),
  scheduledEnd: v.optional(v.number()),
  actualStart: v.optional(v.number()),
  actualEnd: v.optional(v.number()),
  maxParticipants: v.optional(v.number()),
  enableWaitingRoom: v.optional(v.boolean()),
  hostId: v.id("users"),
  participantCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_room_id_and_scheduled_start", ["roomId", "scheduledStart"])
  .index("by_host_id", ["hostId"])
  .index("by_status", ["status"])
  .index("by_scheduled_start", ["scheduledStart"])
  .index("by_actual_start", ["actualStart"]);
