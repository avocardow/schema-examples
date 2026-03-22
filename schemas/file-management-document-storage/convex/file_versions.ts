// file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_versions = defineTable({
  fileId: v.id("files"), // Which file this version belongs to. Cascade: deleting a file removes all its versions.
  versionNumber: v.number(), // Monotonic counter per file: 1, 2, 3, ...
  storageKey: v.string(), // Path to this version's bytes. Each version has its own storage location.
  size: v.number(), // This version's file size in bytes.
  checksumSha256: v.optional(v.string()), // This version's content hash.
  mimeType: v.string(), // This version's MIME type. May differ between versions.
  changeSummary: v.optional(v.string()), // Human-readable description of what changed in this version.

  // Denormalized flag: true for the active version.
  // Kept in sync with files.current_version_id.
  isCurrent: v.boolean(),

  createdBy: v.id("users"), // Who uploaded this version.
  // No updatedAt — versions are immutable (append-only).
})
  .index("by_file_id_version_number", ["fileId", "versionNumber"])
  .index("by_file_id_is_current", ["fileId", "isCurrent"])
  .index("by_storage_key", ["storageKey"]);
