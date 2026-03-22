// multipart_uploads: Tracks in-progress multipart/resumable uploads with progress and expiry.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "multipart_uploads"
 * Document ID: Firestore auto-generated or UUID
 *
 * Tracks large file uploads that are split into multiple parts (S3-style) or
 * resumed after interruption (tus-style). On completion, a file record is created
 * and the upload parts are cleaned up.
 */

/**
 * Allowed statuses for a multipart upload.
 * - in_progress: actively receiving parts.
 * - completing: all parts received, assembling final file.
 * - completed: file assembled and file record created.
 * - aborted: explicitly canceled by user or system.
 * - expired: server-side timeout reached.
 */
export const MULTIPART_UPLOAD_STATUS = /** @type {const} */ ({
  IN_PROGRESS: "in_progress",
  COMPLETING:  "completing",
  COMPLETED:   "completed",
  ABORTED:     "aborted",
  EXPIRED:     "expired",
});

/**
 * Upload type.
 * - single: standard single-request upload.
 * - multipart: S3-style multipart (parts uploaded in parallel).
 * - resumable: tus-style resumable (sequential with offset tracking).
 */
export const UPLOAD_TYPE = /** @type {const} */ ({
  SINGLE:    "single",
  MULTIPART: "multipart",
  RESUMABLE: "resumable",
});

/**
 * @typedef {Object} MultipartUploadDocument
 * @property {string}      bucketId       - Reference to a storage_buckets document. Cascade-delete when the bucket is removed.
 * @property {string}      storageKey     - Intended storage path for the completed file.
 * @property {string}      filename       - Intended filename for the completed file.
 * @property {string|null} mimeType       - Expected MIME type. Null if not known at initiation.
 * @property {number|null} totalSize      - Expected total size in bytes. Null when size is unknown at start (tus Upload-Defer-Length).
 * @property {number}      uploadedSize   - Bytes received so far. Progress = uploadedSize / totalSize.
 * @property {number}      partCount      - Number of parts received so far.
 * @property {string}      status         - One of MULTIPART_UPLOAD_STATUS values.
 * @property {string}      uploadType     - One of UPLOAD_TYPE values.
 * @property {Object|null} metadata       - Upload metadata key-value pairs from the client.
 * @property {string}      initiatedBy    - Reference to a users document. Who started the upload.
 * @property {Timestamp}   expiresAt      - Server-set expiry for cleanup.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<MultipartUploadDocument, "bucketId" | "storageKey" | "filename" | "initiatedBy" | "expiresAt"> & Partial<Pick<MultipartUploadDocument, "mimeType" | "totalSize" | "uploadedSize" | "partCount" | "status" | "uploadType" | "metadata">>} fields
 * @returns {Omit<MultipartUploadDocument, "id">}
 */
export function createMultipartUpload(fields) {
  return {
    bucketId:     fields.bucketId,
    storageKey:   fields.storageKey,
    filename:     fields.filename,
    mimeType:     fields.mimeType     ?? null,
    totalSize:    fields.totalSize    ?? null,
    uploadedSize: fields.uploadedSize ?? 0,
    partCount:    fields.partCount    ?? 0,
    status:       fields.status       ?? MULTIPART_UPLOAD_STATUS.IN_PROGRESS,
    uploadType:   fields.uploadType   ?? UPLOAD_TYPE.SINGLE,
    metadata:     fields.metadata     ?? {},
    initiatedBy:  fields.initiatedBy,
    expiresAt:    fields.expiresAt,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("multipart_uploads").withConverter(multipartUploadConverter)
 */
export const multipartUploadConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      bucketId:     data.bucketId,
      storageKey:   data.storageKey,
      filename:     data.filename,
      mimeType:     data.mimeType     ?? null,
      totalSize:    data.totalSize    ?? null,
      uploadedSize: data.uploadedSize ?? 0,
      partCount:    data.partCount    ?? 0,
      status:       data.status       ?? MULTIPART_UPLOAD_STATUS.IN_PROGRESS,
      uploadType:   data.uploadType   ?? UPLOAD_TYPE.SINGLE,
      metadata:     data.metadata     ?? {},
      initiatedBy:  data.initiatedBy,
      expiresAt:    data.expiresAt,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - multipart_uploads.initiatedBy  ASC  — "All uploads by this user."
 *   - multipart_uploads.status       ASC  — "All uploads in a given state."
 *
 * Composite:
 *   - multipart_uploads.bucketId + status  ASC  — "All in-progress uploads in this bucket."
 *   - multipart_uploads.expiresAt + status ASC  — "Expired uploads still marked in_progress (cleanup job)."
 */
