// track_files: encoded audio files for tracks at various quality levels.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const track_files = defineTable({
  trackId: v.id("tracks"),
  fileId: v.id("files"),
  quality: v.union(
    v.literal("low"),
    v.literal("normal"),
    v.literal("high"),
    v.literal("lossless")
  ),
  codec: v.string(),
  bitrateKbps: v.optional(v.number()),
  sampleRateHz: v.optional(v.number()),
  fileSizeBytes: v.number(),
})
  .index("by_track_id_quality", ["trackId", "quality"])
  .index("by_file_id", ["fileId"]);
