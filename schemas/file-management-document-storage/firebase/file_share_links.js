// file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_share_links"
 * Document ID: Firestore auto-generated or UUID
 *
 * URL-based sharing with optional password protection, expiry, and download tracking.
 * Link shares are distinct from direct shares — they use a token for access instead of
 * a user identity, and they track download counts. A single file or folder can have
 * multiple active links with different permissions and scopes.
 *
 * Security notes:
 *   - passwordHash is hashed — never store plaintext passwords.
 *   - token must be generated with a cryptographically secure random string.
 */

/** @typedef {"file"|"folder"} FileShareLinkTargetType */

export const FILE_SHARE_LINK_TARGET_TYPES = /** @type {const} */ ({
  FILE: "file",
  FOLDER: "folder",
});

/** @typedef {"anyone"|"organization"|"specific_users"} FileShareLinkScope */

export const FILE_SHARE_LINK_SCOPES = /** @type {const} */ ({
  ANYONE: "anyone",
  ORGANIZATION: "organization",
  SPECIFIC_USERS: "specific_users",
});

/** @typedef {"view"|"download"|"edit"|"upload"} FileShareLinkPermission */

export const FILE_SHARE_LINK_PERMISSIONS = /** @type {const} */ ({
  VIEW: "view",
  DOWNLOAD: "download",
  EDIT: "edit",
  UPLOAD: "upload",
});

/**
 * @typedef {Object} FileShareLinkDocument
 * @property {FileShareLinkTargetType} targetType     - Discriminator: "file" or "folder".
 * @property {string|null}             targetFileId   - Reference to the target file. Set when targetType = "file".
 * @property {string|null}             targetFolderId - Reference to the target folder. Set when targetType = "folder".
 * @property {string}                  createdBy      - Reference to the user who created this link.
 * @property {string}                  token          - URL-safe token for the share link.
 * @property {FileShareLinkScope}      scope          - Who can access the link.
 * @property {FileShareLinkPermission} permission     - What the recipient can do.
 * @property {string|null}             passwordHash   - Hashed — never store plaintext.
 * @property {Timestamp|null}          expiresAt      - When the link expires. Null = never expires.
 * @property {number|null}             maxDownloads   - Maximum downloads allowed. Null = unlimited.
 * @property {number}                  downloadCount  - How many times the link has been used to download.
 * @property {string|null}             name           - Human-readable name (e.g., "Client review link").
 * @property {boolean}                 isActive       - Disable a link without deleting it.
 * @property {Timestamp}               createdAt
 * @property {Timestamp}               updatedAt
 */

/**
 * @param {Pick<FileShareLinkDocument, "targetType" | "createdBy" | "token"> & Partial<Pick<FileShareLinkDocument, "targetFileId" | "targetFolderId" | "scope" | "permission" | "passwordHash" | "expiresAt" | "maxDownloads" | "downloadCount" | "name" | "isActive">>} fields
 * @returns {Omit<FileShareLinkDocument, "id">}
 */
export function createFileShareLink(fields) {
  return {
    targetType:     fields.targetType,
    targetFileId:   fields.targetFileId   ?? null,
    targetFolderId: fields.targetFolderId ?? null,
    createdBy:      fields.createdBy,
    token:          fields.token,
    scope:          fields.scope          ?? "anyone",
    permission:     fields.permission     ?? "view",
    passwordHash:   fields.passwordHash   ?? null,
    expiresAt:      fields.expiresAt      ?? null,
    maxDownloads:   fields.maxDownloads   ?? null,
    downloadCount:  fields.downloadCount  ?? 0,
    name:           fields.name           ?? null,
    isActive:       fields.isActive       ?? true,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_share_links").withConverter(fileShareLinkConverter)
 */
export const fileShareLinkConverter = {
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
      createdBy:      data.createdBy,
      token:          data.token,
      scope:          data.scope          ?? "anyone",
      permission:     data.permission     ?? "view",
      passwordHash:   data.passwordHash   ?? null,
      expiresAt:      data.expiresAt      ?? null,
      maxDownloads:   data.maxDownloads   ?? null,
      downloadCount:  data.downloadCount  ?? 0,
      name:           data.name           ?? null,
      isActive:       data.isActive       ?? true,
      createdAt:      data.createdAt,               // Timestamp
      updatedAt:      data.updatedAt,               // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - file_share_links.targetType + targetFileId   ASC  — "All share links for this file."
 *   - file_share_links.targetType + targetFolderId ASC  — "All share links for this folder."
 *
 * Single-field:
 *   - file_share_links.createdBy   ASC  — "All share links created by this user."
 *   - file_share_links.expiresAt   ASC  — Cleanup job: find and deactivate expired links.
 *   - file_share_links.token       ASC  — Unique lookup by token (also enforce uniqueness in app layer).
 */
