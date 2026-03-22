// file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_favorites = defineTable({
  userId: v.id("users"), // Who favorited the file. Cascade: deleting a user removes all their favorites.
  fileId: v.id("files"), // The favorited file. Cascade: deleting a file removes all its favorites.
  // no createdAt — Convex provides _creationTime
})
  .index("by_user_id", ["userId"])
  .index("by_file_id", ["fileId"])
  .index("by_user_file", ["userId", "fileId"]);
