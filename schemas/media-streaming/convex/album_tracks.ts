// album_tracks: track listing within albums with disc and position ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const album_tracks = defineTable({
  albumId: v.id("albums"),
  trackId: v.id("tracks"),
  discNumber: v.number(),
  position: v.number(),
})
  .index("by_album_id_disc_number_position", ["albumId", "discNumber", "position"])
  .index("by_track_id", ["trackId"]);
