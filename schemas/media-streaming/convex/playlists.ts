// playlists: user-created or curated collections of tracks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const playlists = defineTable({
  ownerId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  coverFileId: v.optional(v.id("files")),
  isPublic: v.boolean(),
  isCollaborative: v.boolean(),
  trackCount: v.number(),
  followerCount: v.number(),
  totalDurationMs: v.number(),
  updatedAt: v.number(),
})
  .index("by_owner_id_creation_time", ["ownerId", "_creationTime"])
  .index("by_is_public_follower_count", ["isPublic", "followerCount"]);
