// blocks: user-to-user block relationships.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BlockDocument
 * @property {string} id
 * @property {string} blockerId - FK → users
 * @property {string} blockedId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<BlockDocument, "id" | "createdAt">} fields
 * @returns {Omit<BlockDocument, "id">}
 */
export function createBlock(fields) {
  return {
    blockerId: fields.blockerId,
    blockedId: fields.blockedId,
    createdAt: Timestamp.now(),
  };
}

export const blockConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      blockerId: data.blockerId,
      blockedId: data.blockedId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - blockerId ASC
 *   - blockedId ASC
 *
 * Composite indexes:
 *   - blockerId ASC, blockedId ASC
 */
