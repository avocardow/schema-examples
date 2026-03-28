// listen_progress: Current playback position per user per episode for resume functionality.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const listen_progress = defineTable({
  userId: v.id("users"),
  episodeId: v.id("episodes"),
  positionMs: v.number(),
  durationMs: v.number(),
  completed: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_user_id_episode_id", ["userId", "episodeId"])
  .index("by_user_id_completed_updated_at", ["userId", "completed", "updatedAt"]);
