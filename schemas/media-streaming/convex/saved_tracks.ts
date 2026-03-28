// saved_tracks: tracks saved to a user's personal library.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const saved_tracks = defineTable({
  userId: v.id("users"),
  trackId: v.id("tracks"),
})
  .index("by_user_id_track_id", ["userId", "trackId"])
  .index("by_user_id_creation_time", ["userId", "_creationTime"]);
