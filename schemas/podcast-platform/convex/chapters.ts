// chapters: time-stamped segments within a podcast episode for navigation and display.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const chapters = defineTable({
  episodeId: v.id("episodes"),
  startTimeMs: v.number(),
  endTimeMs: v.optional(v.number()),
  title: v.string(),
  url: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  isHidden: v.boolean(),
  position: v.number(),
}).index("by_episode_id_and_start_time_ms", ["episodeId", "startTimeMs"]);
