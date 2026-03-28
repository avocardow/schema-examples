// episode_downloads: Offline download records with status, device, and expiry tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const episode_downloads = defineTable({
  userId: v.id("users"),
  episodeId: v.id("episodes"),
  status: v.union(
    v.literal("queued"),
    v.literal("downloading"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("expired")
  ),
  deviceId: v.optional(v.string()),
  fileSizeBytes: v.optional(v.number()),
  downloadedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
})
  .index("by_user_id_status", ["userId", "status"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_user_id_episode_id_device_id", ["userId", "episodeId", "deviceId"]);
