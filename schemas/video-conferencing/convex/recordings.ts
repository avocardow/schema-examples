// recordings: captured audio/video recordings of meetings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recordings = defineTable({
  meetingId: v.id("meetings"),
  fileId: v.optional(v.id("files")),
  type: v.union(
    v.literal("composite"),
    v.literal("audio_only"),
    v.literal("video_only"),
    v.literal("screen_share")
  ),
  status: v.union(
    v.literal("recording"),
    v.literal("processing"),
    v.literal("ready"),
    v.literal("failed"),
    v.literal("deleted")
  ),
  durationSeconds: v.optional(v.number()),
  fileSize: v.optional(v.number()),
  startedAt: v.number(),
  endedAt: v.optional(v.number()),
  startedBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_meeting_id", ["meetingId"])
  .index("by_status", ["status"])
  .index("by_started_by", ["startedBy"]);
