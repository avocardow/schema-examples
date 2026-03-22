// multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "multipart_upload_parts"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each part is a chunk of bytes with its own checksum and storage location.
 * Parts are assembled into the final file when the upload completes.
 * Cascade-delete parts when the parent upload is removed.
 *
 * This table is append-only — no updatedAt.
 */

/**
 * @typedef {Object} MultipartUploadPartDocument
 * @property {string}      uploadId    - Reference to the parent multipart upload. Cascade-delete when the upload is removed.
 * @property {number}      partNumber  - 1-based ordering. Parts are assembled in part_number order. Unique per upload.
 * @property {number}      size        - This part's size in bytes.
 * @property {string|null} checksum    - Per-part integrity hash (e.g., MD5, CRC32). S3 returns this as the part's ETag.
 * @property {string}      storageKey  - Temporary storage location for this part. Cleaned up after assembly.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<MultipartUploadPartDocument, "uploadId" | "partNumber" | "size" | "storageKey"> & Partial<Pick<MultipartUploadPartDocument, "checksum">>} fields
 * @returns {Omit<MultipartUploadPartDocument, "id">}
 */
export function createMultipartUploadPart(fields) {
  return {
    uploadId:   fields.uploadId,
    partNumber: fields.partNumber,
    size:       fields.size,
    checksum:   fields.checksum ?? null,
    storageKey: fields.storageKey,
    createdAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("multipart_upload_parts").withConverter(multipartUploadPartConverter)
 */
export const multipartUploadPartConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      uploadId:   data.uploadId,
      partNumber: data.partNumber,
      size:       data.size,
      checksum:   data.checksum   ?? null,
      storageKey: data.storageKey,
      createdAt:  data.createdAt, // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - multipart_upload_parts.uploadId   ASC  — "All parts for this upload."
 *
 * Composite:
 *   - multipart_upload_parts.uploadId + partNumber   ASC  — Unique constraint: part numbers must be unique within an upload.
 */
