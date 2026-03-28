// listen_history: Append-only listening event log with duration and playback source.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const listen_history = defineTable({
  userId: v.id("users"),
  episodeId: v.id("episodes"),
  startedAt: v.number(),
  endedAt: v.optional(v.number()),
  positionStartMs: v.number(),
  positionEndMs: v.optional(v.number()),
  durationListenedMs: v.number(),
  source: v.union(
    v.literal("app"),
    v.literal("web"),
    v.literal("car"),
    v.literal("smart_speaker"),
    v.literal("watch"),
    v.literal("unknown")
  ),
})
  .index("by_user_id_started_at", ["userId", "startedAt"])
  .index("by_episode_id_started_at", ["episodeId", "startedAt"]);
