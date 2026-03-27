// transcript_segments: individual spoken segments within a transcript, with timing and speaker info.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const transcriptSegments = defineTable({
  transcriptId: v.id("transcripts"),
  speakerId: v.optional(v.id("users")),
  content: v.string(),
  speakerName: v.optional(v.string()),
  startMs: v.number(),
  endMs: v.number(),
  position: v.number(),
  confidence: v.optional(v.number()),
})
  .index("by_transcript_id_and_position", ["transcriptId", "position"])
  .index("by_transcript_id_and_start_ms", ["transcriptId", "startMs"])
  .index("by_speaker_id", ["speakerId"]);
