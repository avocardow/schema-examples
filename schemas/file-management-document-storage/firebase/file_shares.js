// file_shares: Direct access grants to specific users, groups, or organizations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_shares"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - targetType discriminates whether a file or folder is being shared.
 *     Exactly one of targetFileId or targetFolderId is set per share.
 *   - sharedWithId is polymorphic — it references users, groups, or organizations
 *     depending on sharedWithType. Not enforced as a FK.
 *   - acceptedAt enables a "Shared with you" inbox with accept/decline workflow.
 */

export const FILE_SHARE_TARGET_TYPE = /** @type {const} */ ({
  FILE: "file",
  FOLDER: "folder",
});

export const FILE_SHARE_SHARED_WITH_TYPE = /** @type {const} */ ({
  USER: "user",
  GROUP: "group",
  ORGANIZATION: "organization",
});

export const FILE_SHARE_ROLE = /** @type {const} */ ({
  VIEWER: "viewer",
  COMMENTER: "commenter",
  EDITOR: "editor",
  CO_OWNER: "co_owner",
});

/**
 * @typedef {Object} FileShareDocument
 * @property {string}         id             - Document ID (from snapshot.id).
 * @property {string}         targetType     - Discriminator: "file" or "folder".
 * @property {string|null}    targetFileId   - Reference to the shared file. Set when targetType = "file".
 * @property {string|null}    targetFolderId - Reference to the shared folder. Set when targetType = "folder".
 * @property {string}         sharedBy       - Reference to the user who created this share.
 * @property {string}         sharedWithType - Who the share is granted to: "user", "group", or "organization".
 * @property {string}         sharedWithId   - Polymorphic ID of the recipient. Not a FK.
 * @property {string}         role           - Permission level: "viewer", "commenter", "editor", or "co_owner".
 * @property {boolean}        allowReshare   - Whether the recipient can share this item with others.
 * @property {Timestamp|null} expiresAt      - When this share expires. Null = never expires.
 * @property {Timestamp|null} acceptedAt     - When the recipient accepted. Null = pending.
 * @property {string|null}    message        - Optional message to the recipient.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<FileShareDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FileShareDocument, "id">}
 */
export function createFileShare(fields) {
  return {
    targetType:     fields.targetType,
    targetFileId:   fields.targetFileId   ?? null,
    targetFolderId: fields.targetFolderId ?? null,
    sharedBy:       fields.sharedBy,
    sharedWithType: fields.sharedWithType,
    sharedWithId:   fields.sharedWithId,
    role:           fields.role,
    allowReshare:   fields.allowReshare   ?? false,
    expiresAt:      fields.expiresAt      ?? null,
    acceptedAt:     fields.acceptedAt     ?? null,
    message:        fields.message        ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_shares").withConverter(fileShareConverter)
 */
export const fileShareConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      targetType:     data.targetType,
      targetFileId:   data.targetFileId   ?? null,
      targetFolderId: data.targetFolderId ?? null,
      sharedBy:       data.sharedBy,
      sharedWithType: data.sharedWithType,
      sharedWithId:   data.sharedWithId,
      role:           data.role,
      allowReshare:   data.allowReshare   ?? false,
      expiresAt:      data.expiresAt      ?? null,
      acceptedAt:     data.acceptedAt     ?? null,
      message:        data.message        ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - file_shares.targetType     ASC
 *     file_shares.targetFileId   ASC
 *     — "All shares for this file."
 *
 *   - file_shares.targetType     ASC
 *     file_shares.targetFolderId ASC
 *     — "All shares for this folder."
 *
 *   - file_shares.sharedWithType ASC
 *     file_shares.sharedWithId   ASC
 *     — "All items shared with this user/group/organization."
 *
 * Single-field:
 *   - file_shares.sharedBy       ASC  — "All shares created by this user."
 *   - file_shares.expiresAt      ASC  — Cleanup job: find and revoke expired shares.
 */
