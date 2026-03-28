// clips: short clips extracted from podcast episodes with start time and duration.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const clips = defineTable({
  episodeId: v.id("episodes"),
  createdBy: v.id("users"),
  title: v.string(),
  startTimeMs: v.number(),
  durationMs: v.number(),
})
  .index("by_episode_id", ["episodeId"])
  .index("by_created_by", ["createdBy"]);
