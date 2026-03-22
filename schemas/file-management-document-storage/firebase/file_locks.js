// file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_locks"
 * Document ID: Firestore auto-generated or UUID
 *
 * At most one lock per file (enforced by application logic or using fileId as document ID).
 * The lock_type indicates the lock's mode: exclusive (only the lock holder can edit) or
 * shared (cooperative read-only — signals that the file should not be modified).
 * Locks can expire automatically or be held until manually released.
 *
 * No updatedAt — locks are short-lived; to extend a lock, release and re-acquire.
 */

export const LOCK_TYPE = /** @type {const} */ ({
  EXCLUSIVE: "exclusive",
  SHARED: "shared",
});

/**
 * @typedef {Object} FileLockDocument
 * @property {string}         fileId    - Reference to the locked file document. One lock per file.
 * @property {string}         lockedBy  - Reference to the user who holds the lock.
 * @property {string}         lockType  - "exclusive" or "shared".
 * @property {string|null}    reason    - Why the file is locked (e.g., "Editing in Word", "Under review").
 * @property {Timestamp|null} expiresAt - When the lock automatically expires. Null = indefinite.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Pick<FileLockDocument, "fileId" | "lockedBy"> & Partial<Pick<FileLockDocument, "lockType" | "reason" | "expiresAt">>} fields
 * @returns {Omit<FileLockDocument, "id">}
 */
export function createFileLock(fields) {
  return {
    fileId:    fields.fileId,
    lockedBy:  fields.lockedBy,
    lockType:  fields.lockType  ?? LOCK_TYPE.EXCLUSIVE,
    reason:    fields.reason    ?? null,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
    // No updatedAt — locks are short-lived; to extend, release and re-acquire.
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_locks").withConverter(fileLockConverter)
 */
export const fileLockConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      fileId:    data.fileId,
      lockedBy:  data.lockedBy,
      lockType:  data.lockType  ?? LOCK_TYPE.EXCLUSIVE,
      reason:    data.reason    ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt, // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_locks.fileId    ASC UNIQUE — Only one lock per file (or use fileId as document ID).
 *   - file_locks.lockedBy  ASC       — "All files locked by this user."
 *   - file_locks.expiresAt ASC       — Cleanup job: find and release expired locks.
 */
