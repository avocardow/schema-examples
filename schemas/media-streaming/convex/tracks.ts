// tracks: individual audio tracks with playback stats and metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tracks = defineTable({
  title: v.string(),
  durationMs: v.number(),
  explicit: v.boolean(),
  isrc: v.optional(v.string()),
  popularity: v.number(),
  previewUrl: v.optional(v.string()),
  playCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_popularity", ["popularity"])
  .index("by_play_count", ["playCount"])
  .index("by_isrc", ["isrc"])
  .index("by_title", ["title"]);
