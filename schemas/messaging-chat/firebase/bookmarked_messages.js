// bookmarked_messages: User-saved messages for quick reference.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BookmarkedMessageDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} messageId - FK → messages
 * @property {string | null} note
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createBookmarkedMessage(fields) {
  return {
    userId: fields.userId,
    messageId: fields.messageId,
    note: fields.note ?? null,
    createdAt: Timestamp.now(),
  };
}

export const bookmarkedMessageConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      messageId: data.messageId,
      note: data.note ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - userId    ASC
 *   - messageId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
