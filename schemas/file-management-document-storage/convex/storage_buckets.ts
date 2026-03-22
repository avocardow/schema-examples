// storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const storage_buckets = defineTable({
  name: v.string(), // Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
  description: v.optional(v.string()), // Explain what this bucket is for.

  // Controls anonymous read access to files in this bucket.
  // false = all access requires authentication.
  // true = files are publicly readable (e.g., CDN-served assets).
  isPublic: v.boolean(),

  allowedMimeTypes: v.optional(v.array(v.string())), // Whitelist of accepted MIME types. Null = all types allowed.
  maxFileSize: v.optional(v.number()), // Maximum file size in bytes. Null = no limit.

  // Whether files in this bucket track version history.
  // When true, uploading a new version creates a file_versions record instead of replacing the file.
  versioningEnabled: v.boolean(),

  createdBy: v.id("users"), // Who created this bucket. Restrict: don't delete users who own buckets.
  updatedAt: v.number(),
})
  .index("by_name", ["name"]);
