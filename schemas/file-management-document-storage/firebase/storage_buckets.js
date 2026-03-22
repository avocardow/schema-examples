// storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "storage_buckets"
 * Document ID: Firestore auto-generated or UUID
 *
 * Buckets isolate file namespaces and enforce upload constraints (allowed MIME types, max file size).
 * Every file belongs to exactly one bucket. Inspired by S3 buckets and Supabase Storage buckets.
 */

/**
 * @typedef {Object} StorageBucketDocument
 * @property {string}        name              - Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
 * @property {string|null}   description       - Explain what this bucket is for.
 * @property {boolean}       isPublic          - Controls anonymous read access. false = requires auth, true = publicly readable.
 * @property {string[]|null} allowedMimeTypes  - Whitelist of accepted MIME types. Null = all types allowed.
 * @property {number|null}   maxFileSize       - Maximum file size in bytes. Null = no limit.
 * @property {boolean}       versioningEnabled - Whether files in this bucket track version history.
 * @property {string}        createdBy         - Reference to a users document. Who created this bucket.
 * @property {Timestamp}     createdAt
 * @property {Timestamp}     updatedAt
 */

/**
 * @param {Pick<StorageBucketDocument, "name" | "createdBy"> & Partial<Pick<StorageBucketDocument, "description" | "isPublic" | "allowedMimeTypes" | "maxFileSize" | "versioningEnabled">>} fields
 * @returns {Omit<StorageBucketDocument, "id">}
 */
export function createStorageBucket(fields) {
  return {
    name:              fields.name,
    description:       fields.description       ?? null,
    isPublic:          fields.isPublic          ?? false,
    allowedMimeTypes:  fields.allowedMimeTypes  ?? null,
    maxFileSize:       fields.maxFileSize       ?? null,
    versioningEnabled: fields.versioningEnabled ?? false,
    createdBy:         fields.createdBy,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("storage_buckets").withConverter(storageBucketConverter)
 */
export const storageBucketConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      name:              data.name,
      description:       data.description       ?? null,
      isPublic:          data.isPublic          ?? false,
      allowedMimeTypes:  data.allowedMimeTypes  ?? null,
      maxFileSize:       data.maxFileSize       ?? null,
      versioningEnabled: data.versioningEnabled ?? false,
      createdBy:         data.createdBy,
      createdAt:         data.createdAt,
      updatedAt:         data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - storage_buckets.name       ASC  — Unique constraint enforced at application level.
 *   - storage_buckets.createdBy  ASC  — (Optional) "All buckets created by this user."
 */
