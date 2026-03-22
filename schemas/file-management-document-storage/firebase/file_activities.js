// file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_activities"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Activities are immutable (append-only). No updatedAt — once logged, never changed.
 *   - targetId is intentionally not a foreign key — the target file or folder
 *     may be permanently deleted. targetName is denormalized so the audit trail
 *     remains readable after deletion.
 */

export const FILE_ACTIVITY_ACTION = /** @type {const} */ ({
  CREATED:         "created",
  UPLOADED:        "uploaded",
  UPDATED:         "updated",
  RENAMED:         "renamed",
  MOVED:           "moved",
  COPIED:          "copied",
  DELETED:         "deleted",
  RESTORED:        "restored",
  SHARED:          "shared",
  UNSHARED:        "unshared",
  DOWNLOADED:      "downloaded",
  LOCKED:          "locked",
  UNLOCKED:        "unlocked",
  COMMENTED:       "commented",
  VERSION_CREATED: "version_created",
});

export const FILE_ACTIVITY_TARGET_TYPE = /** @type {const} */ ({
  FILE:   "file",
  FOLDER: "folder",
});

/**
 * @typedef {Object} FileActivityDocument
 * @property {string}         id          - Document ID (from snapshot.id).
 * @property {string}         actorId     - FK → users. Who performed the action.
 * @property {string}         action      - One of FILE_ACTIVITY_ACTION values.
 * @property {string}         targetType  - One of FILE_ACTIVITY_TARGET_TYPE values.
 * @property {string}         targetId    - The file or folder ID. Not a FK — target may be permanently deleted.
 * @property {string}         targetName  - Denormalized: file/folder name at the time of the action.
 * @property {Object|null}    details     - Action-specific context (e.g., moved: {fromFolderId, toFolderId}).
 * @property {string|null}    ipAddress   - Client IP address for security audit.
 * @property {Timestamp}      createdAt   - When the activity occurred. Immutable.
 */

/**
 * @param {Omit<FileActivityDocument, "id" | "createdAt">} fields
 * @returns {Omit<FileActivityDocument, "id">}
 */
export function createFileActivity(fields) {
  return {
    actorId:    fields.actorId,
    action:     fields.action,
    targetType: fields.targetType,
    targetId:   fields.targetId,
    targetName: fields.targetName,
    details:    fields.details    ?? null,
    ipAddress:  fields.ipAddress  ?? null,
    createdAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_activities").withConverter(fileActivityConverter)
 */
export const fileActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      actorId:    data.actorId,
      action:     data.action,
      targetType: data.targetType,
      targetId:   data.targetId,
      targetName: data.targetName,
      details:    data.details    ?? null,
      ipAddress:  data.ipAddress  ?? null,
      createdAt:  data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_activities.actorId     ASC  — "All actions by this user."
 *   - file_activities.action      ASC  — "All download events" or "all share events."
 *   - file_activities.createdAt   ASC  — Time-range queries and retention cleanup.
 *
 * Composite:
 *   - file_activities.targetType  ASC
 *     file_activities.targetId    ASC
 *     — "All activity for this file/folder."
 */
