// file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_favorites"
 * Document ID: Deterministic — `${userId}_${fileId}`
 *
 * Firestore has no composite unique constraint, so uniqueness on (userId, fileId) is
 * enforced via a deterministic document ID.
 * Using a deterministic ID is the recommended approach — it makes idempotent writes trivial.
 *
 * Security notes:
 *   - When a user is deleted, cascade-delete their file_favorites documents in the same batch.
 *   - When a file is deleted, cascade-delete its file_favorites documents as well.
 */

/**
 * @typedef {Object} FileFavoriteDocument
 * @property {string}    userId    - Reference to the users document. Who favorited the file.
 * @property {string}    fileId    - Reference to the files document. The favorited file.
 * @property {Timestamp} createdAt
 */

/**
 * Returns a deterministic document ID for a (userId, fileId) pair.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} userId
 * @param {string} fileId
 * @returns {string}
 */
export function fileFavoriteDocId(userId, fileId) {
  return `${userId}_${fileId}`;
}

/**
 * @param {{ userId: string; fileId: string }} fields
 * @returns {Omit<FileFavoriteDocument, "id">}
 */
export function createFileFavorite(fields) {
  return {
    userId:    fields.userId,
    fileId:    fields.fileId,
    createdAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_favorites").withConverter(fileFavoriteConverter)
 */
export const fileFavoriteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      userId:    data.userId,
      fileId:    data.fileId,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_favorites.userId  ASC  — "All files favorited by this user."
 *   - file_favorites.fileId  ASC  — "How many users favorited this file?"
 */
