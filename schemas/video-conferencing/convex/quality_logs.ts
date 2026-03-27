// quality_logs: periodic network and media quality snapshots per participant.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const qualityLogs = defineTable({
  meetingId: v.id("meetings"),
  participantId: v.id("meeting_participants"),
  bitrateKbps: v.optional(v.number()),
  packetLossPct: v.optional(v.number()),
  jitterMs: v.optional(v.number()),
  roundTripMs: v.optional(v.number()),
  videoWidth: v.optional(v.number()),
  videoHeight: v.optional(v.number()),
  framerate: v.optional(v.number()),
  qualityScore: v.optional(v.number()),
  loggedAt: v.number(),
})
  .index("by_meeting_id_and_logged_at", ["meetingId", "loggedAt"])
  .index("by_participant_id_and_logged_at", ["participantId", "loggedAt"]);
