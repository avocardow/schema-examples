// multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const multipart_upload_parts = defineTable({
  uploadId: v.id("multipart_uploads"), // The upload session this part belongs to. Cascade: aborting/deleting an upload removes all its parts.

  partNumber: v.number(), // 1-based ordering. Parts are assembled in part_number order.

  size: v.number(), // This part's size in bytes.

  checksum: v.optional(v.string()), // Per-part integrity hash (e.g., MD5, CRC32). S3 returns this as the part's ETag.

  storageKey: v.string(), // Temporary storage location for this part. Cleaned up after assembly into the final file.

  // no createdAt — Convex provides _creationTime
})
  .index("by_upload_id_part_number", ["uploadId", "partNumber"]);
