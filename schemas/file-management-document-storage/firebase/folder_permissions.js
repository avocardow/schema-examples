// folder_permissions: Per-user permission grants on folders with inheritance tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "folder_permissions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Each document grants a single user a permission level on a single folder.
 *   - The composite unique constraint (folderId + userId) is enforced at the
 *     application layer — Firestore has no native unique indexes.
 *   - "inherited" flags whether this permission was propagated from a parent
 *     folder, making it easy to distinguish explicit grants from cascaded ones.
 *   - grantedBy is nullable so the field survives if the granting user is deleted.
 */

export const FOLDER_PERMISSION_LEVEL = /** @type {const} */ ({
  VIEW:   "view",
  EDIT:   "edit",
  MANAGE: "manage",
});

/**
 * @typedef {Object} FolderPermissionDocument
 * @property {string}      id         - Document ID (from snapshot.id).
 * @property {string}      folderId   - Reference to a folders document.
 * @property {string}      userId     - Reference to a users document.
 * @property {string}      permission - Permission level: "view", "edit", or "manage".
 * @property {boolean}     inherited  - Whether this permission was inherited from a parent folder.
 * @property {string|null} grantedBy  - Reference to the user who granted this permission. Null if that user was deleted.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<FolderPermissionDocument, "folderId" | "userId"> & Partial<Pick<FolderPermissionDocument, "permission" | "inherited" | "grantedBy">>} fields
 * @returns {Omit<FolderPermissionDocument, "id">}
 */
export function createFolderPermission(fields) {
  return {
    folderId:   fields.folderId,
    userId:     fields.userId,
    permission: fields.permission ?? FOLDER_PERMISSION_LEVEL.VIEW,
    inherited:  fields.inherited  ?? false,
    grantedBy:  fields.grantedBy  ?? null,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("folder_permissions").withConverter(folderPermissionConverter)
 */
export const folderPermissionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      folderId:   data.folderId,
      userId:     data.userId,
      permission: data.permission ?? FOLDER_PERMISSION_LEVEL.VIEW,
      inherited:  data.inherited  ?? false,
      grantedBy:  data.grantedBy  ?? null,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - folder_permissions.folderId ASC
 *     folder_permissions.userId   ASC
 *     — Unique pair: one permission entry per user per folder (enforce in app layer).
 *
 * Single-field:
 *   - folder_permissions.userId   ASC  — "All folders this user has access to."
 *   - folder_permissions.folderId ASC  — "All users with access to this folder."
 */
