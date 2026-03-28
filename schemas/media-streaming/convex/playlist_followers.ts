// playlist_followers: users who follow specific playlists.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const playlist_followers = defineTable({
  playlistId: v.id("playlists"),
  userId: v.id("users"),
})
  .index("by_playlist_id_user_id", ["playlistId", "userId"])
  .index("by_user_id_creation_time", ["userId", "_creationTime"]);
