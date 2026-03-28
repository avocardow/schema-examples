// lyrics: song lyrics with optional time-synced data for karaoke display.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const lyrics = defineTable({
  trackId: v.id("tracks"),
  plainText: v.optional(v.string()),
  syncedText: v.optional(v.any()),
  language: v.optional(v.string()),
  source: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_track_id", ["trackId"])
  .index("by_language", ["language"]);
