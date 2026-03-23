// bookmarks: user-saved posts for later reading.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BookmarkDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} postId - FK → posts
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<BookmarkDocument, "id" | "createdAt">} fields
 * @returns {Omit<BookmarkDocument, "id">}
 */
export function createBookmark(fields) {
  return {
    userId: fields.userId,
    postId: fields.postId,
    createdAt: Timestamp.now(),
  };
}

export const bookmarkConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      postId: data.postId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - userId ASC
 *   - postId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
