// storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "storage_quotas"
 * Document ID: Firestore auto-generated or UUID
 *
 * Tracks per-entity storage limits and cached usage. Supports quotas on users,
 * organizations, or individual buckets. Usage fields (usedBytes, fileCount)
 * are cached values — recompute periodically via background jobs and record
 * when in lastComputedAt.
 */

export const STORAGE_QUOTA_ENTITY_TYPE = /** @type {const} */ ({
  USER: "user",
  ORGANIZATION: "organization",
  BUCKET: "bucket",
});

/**
 * @typedef {Object} StorageQuotaDocument
 * @property {string}         entityType      - "user", "organization", or "bucket".
 * @property {string}         entityId        - Polymorphic reference to users, organizations, or storage_buckets.
 * @property {number}         quotaBytes      - Storage limit in bytes. Enforced at upload time.
 * @property {number}         usedBytes       - Cached: total bytes consumed. Updated on upload/delete.
 * @property {number}         fileCount       - Cached: total file count. Updated on upload/delete.
 * @property {Timestamp|null} lastComputedAt  - When usage was last recomputed. Null = never recomputed.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Pick<StorageQuotaDocument, "entityType" | "entityId" | "quotaBytes"> & Partial<Pick<StorageQuotaDocument, "usedBytes" | "fileCount" | "lastComputedAt">>} fields
 * @returns {Omit<StorageQuotaDocument, "id">}
 */
export function createStorageQuota(fields) {
  return {
    entityType:     fields.entityType,
    entityId:       fields.entityId,
    quotaBytes:     fields.quotaBytes,
    usedBytes:      fields.usedBytes      ?? 0,
    fileCount:      fields.fileCount      ?? 0,
    lastComputedAt: fields.lastComputedAt ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("storage_quotas").withConverter(storageQuotaConverter)
 */
export const storageQuotaConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      entityType:     data.entityType,
      entityId:       data.entityId,
      quotaBytes:     data.quotaBytes,
      usedBytes:      data.usedBytes      ?? 0,
      fileCount:      data.fileCount      ?? 0,
      lastComputedAt: data.lastComputedAt ?? null,
      createdAt:      data.createdAt,     // Timestamp
      updatedAt:      data.updatedAt,     // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - storage_quotas (entityType ASC, entityId ASC) UNIQUE — One quota per entity.
 *
 * Single-field:
 *   - storage_quotas.entityType ASC — "All user quotas" or "all bucket quotas."
 */
