// saved_albums: albums saved to a user's library.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SavedAlbumDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} albumId - FK → albums
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<SavedAlbumDocument, "id" | "createdAt">} fields
 * @returns {Omit<SavedAlbumDocument, "id">}
 */
export function createSavedAlbum(fields) {
  return {
    userId: fields.userId,
    albumId: fields.albumId,
    createdAt: Timestamp.now(),
  };
}

export const savedAlbumConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      albumId: data.albumId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - albumId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
