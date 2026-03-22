// files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "files"
 * Document ID: Firestore auto-generated or UUID
 *
 * The file record describes what the file IS (name, size, type, storage location).
 * Where the file is USED is tracked separately in file_attachments. This separation
 * enables file reuse across entities and clean storage accounting.
 *
 * Soft delete uses deletedAt + deletedBy + originalFolderId — the three fields needed
 * to implement a full trash/restore UX.
 */

/**
 * @typedef {Object} FileDocument
 * @property {string}              id               - Document ID (from snapshot.id).
 * @property {string}              bucketId         - FK → storage_buckets. Which bucket this file belongs to.
 * @property {string|null}         folderId         - FK → folders. Current folder. Null = bucket root (no folder).
 * @property {string}              name             - Current display filename (e.g., "Q4 Report.pdf").
 * @property {string}              originalFilename - Filename at upload time. Never changes after upload.
 * @property {string}              storageKey       - Path to bytes in the storage backend. Immutable after upload.
 * @property {string}              mimeType         - MIME type (e.g., "application/pdf", "image/png").
 * @property {number}              size             - File size in bytes.
 * @property {string|null}         checksumSha256   - SHA-256 hash for duplicate detection and integrity verification.
 * @property {string|null}         etag             - HTTP ETag for cache validation.
 * @property {string|null}         currentVersionId - FK → file_versions. Null until first version is explicitly created.
 * @property {Object|null}         metadata         - System-extracted metadata (dimensions, duration, pages, EXIF).
 * @property {Object|null}         userMetadata     - User-defined key-value pairs.
 * @property {string}              uploadedBy       - FK → users. Who uploaded the file.
 * @property {boolean}             isPublic         - Per-file public access override.
 * @property {Timestamp|null}      deletedAt        - When the file was trashed. Null = not deleted.
 * @property {string|null}         deletedBy        - FK → users. Who trashed the file.
 * @property {string|null}         originalFolderId - FK → folders. Folder the file was in before deletion.
 * @property {Timestamp}           createdAt
 * @property {Timestamp}           updatedAt
 */

/**
 * @param {Pick<FileDocument, "bucketId" | "name" | "originalFilename" | "storageKey" | "mimeType" | "size" | "uploadedBy"> & Partial<Pick<FileDocument, "folderId" | "checksumSha256" | "etag" | "currentVersionId" | "metadata" | "userMetadata" | "isPublic" | "deletedAt" | "deletedBy" | "originalFolderId">>} fields
 * @returns {Omit<FileDocument, "id">}
 */
export function createFile(fields) {
  return {
    bucketId:         fields.bucketId,
    folderId:         fields.folderId         ?? null,
    name:             fields.name,
    originalFilename: fields.originalFilename,
    storageKey:       fields.storageKey,
    mimeType:         fields.mimeType,
    size:             fields.size,
    checksumSha256:   fields.checksumSha256   ?? null,
    etag:             fields.etag             ?? null,
    currentVersionId: fields.currentVersionId ?? null,
    metadata:         fields.metadata         ?? {},
    userMetadata:     fields.userMetadata     ?? {},
    uploadedBy:       fields.uploadedBy,
    isPublic:         fields.isPublic         ?? false,
    deletedAt:        fields.deletedAt        ?? null,
    deletedBy:        fields.deletedBy        ?? null,
    originalFolderId: fields.originalFolderId ?? null,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("files").withConverter(fileConverter)
 */
export const fileConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      bucketId:         data.bucketId,
      folderId:         data.folderId         ?? null,
      name:             data.name,
      originalFilename: data.originalFilename,
      storageKey:       data.storageKey,
      mimeType:         data.mimeType,
      size:             data.size,
      checksumSha256:   data.checksumSha256   ?? null,
      etag:             data.etag             ?? null,
      currentVersionId: data.currentVersionId ?? null,
      metadata:         data.metadata         ?? {},
      userMetadata:     data.userMetadata     ?? {},
      uploadedBy:       data.uploadedBy,
      isPublic:         data.isPublic         ?? false,
      deletedAt:        data.deletedAt        ?? null,
      deletedBy:        data.deletedBy        ?? null,
      originalFolderId: data.originalFolderId ?? null,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - files.storageKey       ASC  — Unique lookup by storage key.
 *   - files.uploadedBy       ASC  — "My files" query.
 *   - files.mimeType         ASC  — Type-based filtering ("All PDFs", "All images").
 *   - files.deletedAt        ASC  — Efficiently exclude trashed files.
 *   - files.checksumSha256   ASC  — Duplicate detection by content hash.
 *
 * Composite:
 *   - files.bucketId         ASC
 *     files.folderId         ASC
 *     — "All files in this folder" — the directory listing query.
 *
 *   - files.bucketId         ASC
 *     files.deletedAt        ASC
 *     — "All active files in this bucket."
 */
