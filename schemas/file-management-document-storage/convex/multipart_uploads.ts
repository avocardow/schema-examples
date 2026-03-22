// multipart_uploads: Resumable upload session tracking — lifecycle management from initiation to completion or expiry.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const multipart_uploads = defineTable({
  bucketId: v.id("storage_buckets"), // Target bucket for the upload. Cascade: deleting a bucket cancels all its pending uploads.
  storageKey: v.string(), // Intended storage path for the completed file.
  filename: v.string(), // Intended filename for the completed file.
  mimeType: v.optional(v.string()), // Expected MIME type. Nullable: may not be known at initiation.
  totalSize: v.optional(v.number()), // Expected total size in bytes. Nullable: tus supports Upload-Defer-Length.
  uploadedSize: v.number(), // Bytes received so far. Progress = uploadedSize / totalSize.
  partCount: v.number(), // Number of parts received so far.

  status: v.union(
    v.literal("in_progress"),
    v.literal("completing"),
    v.literal("completed"),
    v.literal("aborted"),
    v.literal("expired")
  ),
  uploadType: v.union(
    v.literal("single"),
    v.literal("multipart"),
    v.literal("resumable")
  ),
  metadata: v.optional(v.any()), // Upload metadata key-value pairs from the client.

  initiatedBy: v.id("users"), // Who started the upload. Restrict: don't delete users with active uploads.
  expiresAt: v.number(), // Server-set expiry for cleanup. NOT NULL — always set.

  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_bucket_id_status", ["bucketId", "status"])
  .index("by_initiated_by", ["initiatedBy"])
  .index("by_expires_at_status", ["expiresAt", "status"])
  .index("by_status", ["status"]);
