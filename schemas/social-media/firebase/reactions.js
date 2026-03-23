// reactions: user reactions (like, love, etc.) on posts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const REACTION_TYPES = /** @type {const} */ ({
  LIKE: "like",
  LOVE: "love",
  CELEBRATE: "celebrate",
  INSIGHTFUL: "insightful",
  FUNNY: "funny",
});

/**
 * @typedef {Object} ReactionDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} userId - FK → users
 * @property {typeof REACTION_TYPES[keyof typeof REACTION_TYPES]} type
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ReactionDocument, "id" | "createdAt">} fields
 * @returns {Omit<ReactionDocument, "id">}
 */
export function createReaction(fields) {
  return {
    postId: fields.postId,
    userId: fields.userId,
    type: fields.type,
    createdAt: Timestamp.now(),
  };
}

export const reactionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      userId: data.userId,
      type: data.type,
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
 *   - type   ASC
 *
 * Composite indexes:
 *   - postId ASC, type ASC
 *   - userId ASC, createdAt DESC
 *   - postId ASC, userId ASC
 */
