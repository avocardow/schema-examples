// reposts: user reposts (shares) of existing posts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RepostDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<RepostDocument, "id" | "createdAt">} fields
 * @returns {Omit<RepostDocument, "id">}
 */
export function createRepost(fields) {
  return {
    postId: fields.postId,
    userId: fields.userId,
    createdAt: Timestamp.now(),
  };
}

export const repostConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - postId ASC
 *   - userId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 *   - postId ASC, createdAt DESC
 */
