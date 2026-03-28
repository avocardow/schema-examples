// play_history: per-user track listening history with context information.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const play_history = defineTable({
  userId: v.id("users"),
  trackId: v.id("tracks"),
  durationMs: v.number(),
  completed: v.boolean(),
  contextType: v.union(
    v.literal("album"),
    v.literal("playlist"),
    v.literal("artist"),
    v.literal("chart"),
    v.literal("search"),
    v.literal("queue"),
    v.literal("unknown")
  ),
  contextId: v.optional(v.string()),
  playedAt: v.number(),
})
  .index("by_user_id_played_at", ["userId", "playedAt"])
  .index("by_track_id_played_at", ["trackId", "playedAt"]);
