// transcripts: meeting-level transcription jobs and their status.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const transcripts = defineTable({
  meetingId: v.id("meetings"),
  language: v.string(),
  status: v.union(
    v.literal("processing"),
    v.literal("ready"),
    v.literal("failed")
  ),
  startedBy: v.optional(v.id("users")),
  segmentCount: v.number(),
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_meeting_id", ["meetingId"])
  .index("by_status", ["status"]);
