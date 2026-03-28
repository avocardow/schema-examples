// track_credits: artist credits and roles for each track.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const track_credits = defineTable({
  trackId: v.id("tracks"),
  artistId: v.id("artists"),
  role: v.union(
    v.literal("primary_artist"),
    v.literal("featured_artist"),
    v.literal("writer"),
    v.literal("producer"),
    v.literal("composer"),
    v.literal("mixer"),
    v.literal("engineer")
  ),
})
  .index("by_track_id_artist_id_role", ["trackId", "artistId", "role"])
  .index("by_artist_id_role", ["artistId", "role"]);
