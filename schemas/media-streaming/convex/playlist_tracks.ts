// playlist_tracks: tracks added to playlists with ordering and attribution.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const playlist_tracks = defineTable({
  playlistId: v.id("playlists"),
  trackId: v.id("tracks"),
  addedBy: v.id("users"),
  position: v.number(),
  addedAt: v.number(),
})
  .index("by_playlist_id_position", ["playlistId", "position"])
  .index("by_track_id", ["trackId"]);
