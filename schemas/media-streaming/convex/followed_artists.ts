// followed_artists: artists followed by users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const followed_artists = defineTable({
  userId: v.id("users"),
  artistId: v.id("artists"),
})
  .index("by_user_id_artist_id", ["userId", "artistId"])
  .index("by_artist_id", ["artistId"]);
