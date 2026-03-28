// downloads: offline download records for tracks with expiration tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const downloads = defineTable({
  userId: v.id("users"),
  trackId: v.id("tracks"),
  trackFileId: v.id("track_files"),
  status: v.union(
    v.literal("pending"),
    v.literal("downloading"),
    v.literal("completed"),
    v.literal("expired"),
    v.literal("failed")
  ),
  expiresAt: v.optional(v.number()),
  downloadedAt: v.optional(v.number()),
})
  .index("by_user_id_track_file_id", ["userId", "trackFileId"])
  .index("by_user_id_status", ["userId", "status"])
  .index("by_expires_at", ["expiresAt"]);
