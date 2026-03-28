// playlist_episodes: Ordered episodes within playlists.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const playlist_episodes = defineTable({
  playlistId: v.id("playlists"),
  episodeId: v.id("episodes"),
  position: v.number(),
})
  .index("by_playlist_id_position", ["playlistId", "position"])
  .index("by_episode_id", ["episodeId"]);
