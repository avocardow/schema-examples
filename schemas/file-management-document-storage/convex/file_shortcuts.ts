// file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_shortcuts = defineTable({
  folderId: v.id("folders"), // The folder where this shortcut lives. Cascade: deleting the containing folder removes its shortcuts.

  // What the shortcut points to. Exactly one of targetFileId or targetFolderId must be set.
  targetType: v.union(v.literal("file"), v.literal("folder")), // Discriminator for which FK is populated.
  targetFileId: v.optional(v.id("files")), // Populated when targetType = 'file'. Cascade: removed when target file is deleted.
  targetFolderId: v.optional(v.id("folders")), // Populated when targetType = 'folder'. Cascade: removed when target folder is deleted.

  name: v.optional(v.string()), // Override display name. Null = use the target's name.
  createdBy: v.id("users"), // Restrict: don't delete users who created shortcuts.
  // no createdAt — Convex provides _creationTime
})
  .index("by_folder_id", ["folderId"])
  .index("by_target_file_id", ["targetFileId"])
  .index("by_target_folder_id", ["targetFolderId"]);
