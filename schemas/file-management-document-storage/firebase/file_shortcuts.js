// file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_shortcuts"
 * Document ID: Firestore auto-generated or UUID
 *
 * A shortcut points to a file or folder in another location — similar to Google Drive
 * shortcuts or Windows .lnk files. The target continues to exist independently; deleting
 * a shortcut does not affect the target. Deleting the target cascade-deletes the shortcut.
 *
 * This table is append-only — no updatedAt.
 */

export const FILE_SHORTCUT_TARGET_TYPE = /** @type {const} */ ({
  FILE: "file",
  FOLDER: "folder",
});

/**
 * @typedef {Object} FileShortcutDocument
 * @property {string}      folderId       - Reference to the folder where this shortcut lives.
 * @property {string}      targetType     - Discriminator: "file" or "folder".
 * @property {string|null} targetFileId   - Reference to the target file. Set when targetType = "file".
 * @property {string|null} targetFolderId - Reference to the target folder. Set when targetType = "folder".
 * @property {string|null} name           - Override display name. Null = use the target's name.
 * @property {string}      createdBy      - Reference to the user who created this shortcut.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<FileShortcutDocument, "folderId" | "targetType" | "createdBy"> & Partial<Pick<FileShortcutDocument, "targetFileId" | "targetFolderId" | "name">>} fields
 * @returns {Omit<FileShortcutDocument, "id">}
 */
export function createFileShortcut(fields) {
  return {
    folderId:       fields.folderId,
    targetType:     fields.targetType,
    targetFileId:   fields.targetFileId   ?? null,
    targetFolderId: fields.targetFolderId ?? null,
    name:           fields.name           ?? null,
    createdBy:      fields.createdBy,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_shortcuts").withConverter(fileShortcutConverter)
 */
export const fileShortcutConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      folderId:       data.folderId,
      targetType:     data.targetType,
      targetFileId:   data.targetFileId   ?? null,
      targetFolderId: data.targetFolderId ?? null,
      name:           data.name           ?? null,
      createdBy:      data.createdBy,
      createdAt:      data.createdAt,     // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_shortcuts.folderId       ASC  — "All shortcuts in this folder."
 *   - file_shortcuts.targetFileId   ASC  — "All shortcuts pointing to this file."
 *   - file_shortcuts.targetFolderId ASC  — "All shortcuts pointing to this folder."
 */
