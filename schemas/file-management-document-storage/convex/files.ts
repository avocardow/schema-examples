// files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const files = defineTable({
  bucketId: v.id("storage_buckets"), // Which bucket this file belongs to. Cascade: deleting a bucket removes all its files.
  folderId: v.optional(v.id("folders")), // Current folder. Null = bucket root (no folder).

  // Identity and display
  name: v.string(), // Current display filename (e.g., "Q4 Report.pdf"). Can be renamed without affecting storage.
  originalFilename: v.string(), // Filename at upload time. Preserved for audit/history. Never changes after upload.
  storageKey: v.string(), // Path to bytes in the storage backend. Immutable after upload.

  // File properties
  mimeType: v.string(), // MIME type (e.g., "application/pdf", "image/png").
  size: v.number(), // File size in bytes.
  checksumSha256: v.optional(v.string()), // SHA-256 hash. Enables duplicate detection and integrity verification.
  etag: v.optional(v.string()), // HTTP ETag for cache validation.

  // Versioning: pointer to the current active version.
  // Null until the first version is explicitly created (versioning may be off for the bucket).
  currentVersionId: v.optional(v.id("file_versions")),

  // Metadata
  metadata: v.optional(v.any()), // System-extracted metadata (dimensions, duration, pages, EXIF).
  userMetadata: v.optional(v.any()), // User-defined key-value pairs.

  // Ownership
  uploadedBy: v.id("users"), // Who uploaded the file. Restrict: don't delete users who own files.
  isPublic: v.boolean(), // Per-file public access override.

  // Soft delete
  deletedAt: v.optional(v.number()), // When the file was trashed. Null = not deleted.
  deletedBy: v.optional(v.id("users")), // Who trashed the file.
  originalFolderId: v.optional(v.id("folders")), // Folder the file was in before deletion. Enables "Restore to original location".

  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_bucket_folder", ["bucketId", "folderId"])
  .index("by_uploaded_by", ["uploadedBy"])
  .index("by_mime_type", ["mimeType"])
  .index("by_deleted_at", ["deletedAt"])
  .index("by_checksum_sha256", ["checksumSha256"])
  .index("by_bucket_deleted_at", ["bucketId", "deletedAt"])
  .index("by_storage_key", ["storageKey"]);
