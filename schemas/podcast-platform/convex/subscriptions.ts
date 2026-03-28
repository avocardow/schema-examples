// subscriptions: User subscriptions to shows with per-show playback and download settings.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const subscriptions = defineTable({
  userId: v.id("users"),
  showId: v.id("shows"),
  autoDownload: v.boolean(),
  downloadWifiOnly: v.boolean(),
  notificationsEnabled: v.boolean(),
  customPlaybackSpeed: v.optional(v.number()),
  newEpisodeSort: v.union(v.literal("newest_first"), v.literal("oldest_first")),
  updatedAt: v.number(),
})
  .index("by_user_id_show_id", ["userId", "showId"])
  .index("by_show_id", ["showId"]);
