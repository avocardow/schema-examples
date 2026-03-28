// saved_albums: albums saved to a user's personal library.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const saved_albums = defineTable({
  userId: v.id("users"),
  albumId: v.id("albums"),
})
  .index("by_user_id_album_id", ["userId", "albumId"])
  .index("by_user_id_creation_time", ["userId", "_creationTime"]);
