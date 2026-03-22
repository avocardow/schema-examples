// file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_versions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each document represents a point-in-time snapshot of a file with its own
 * storage key, size, checksum, and creator. Uses a monotonic version counter
 * (Box/Google Drive pattern) — human-friendly ("Version 3 of report.pdf")
 * and simple to increment atomically.
 *
 * Versions are immutable (append-only). There is no updatedAt field.
 */

/**
 * @typedef {Object} FileVersionDocument
 * @property {string}      fileId          - Reference to the parent file document.
 * @property {number}      versionNumber   - Monotonic counter per file: 1, 2, 3, ...
 * @property {string}      storageKey      - Path to this version's bytes. Each version has its own storage location.
 * @property {number}      size            - This version's file size in bytes.
 * @property {string|null} checksumSha256  - This version's content hash.
 * @property {string}      mimeType        - This version's MIME type. May differ between versions.
 * @property {string|null} changeSummary   - Human-readable description of what changed in this version.
 * @property {boolean}     isCurrent       - Denormalized flag: true for the active version.
 * @property {string}      createdBy       - Reference to the user who uploaded this version.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<FileVersionDocument, "fileId" | "versionNumber" | "storageKey" | "size" | "mimeType" | "createdBy"> & Partial<Pick<FileVersionDocument, "checksumSha256" | "changeSummary" | "isCurrent">>} fields
 * @returns {Omit<FileVersionDocument, "id">}
 */
export function createFileVersion(fields) {
  return {
    fileId:         fields.fileId,
    versionNumber:  fields.versionNumber,
    storageKey:     fields.storageKey,
    size:           fields.size,
    checksumSha256: fields.checksumSha256 ?? null,
    mimeType:       fields.mimeType,
    changeSummary:  fields.changeSummary  ?? null,
    isCurrent:      fields.isCurrent      ?? false,
    createdBy:      fields.createdBy,
    createdAt:      Timestamp.now(),
    // No updatedAt — versions are immutable (append-only).
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_versions").withConverter(fileVersionConverter)
 */
export const fileVersionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      fileId:         data.fileId,
      versionNumber:  data.versionNumber,
      storageKey:     data.storageKey,
      size:           data.size,
      checksumSha256: data.checksumSha256 ?? null,
      mimeType:       data.mimeType,
      changeSummary:  data.changeSummary  ?? null,
      isCurrent:      data.isCurrent      ?? false,
      createdBy:      data.createdBy,
      createdAt:      data.createdAt,     // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - file_versions (fileId ASC, versionNumber ASC) UNIQUE — Version numbers are unique per file.
 *   - file_versions (fileId ASC, isCurrent ASC)            — "Current version of this file" fast lookup.
 *
 * Single-field:
 *   - file_versions.storageKey ASC — Unique lookup by storage key.
 */
