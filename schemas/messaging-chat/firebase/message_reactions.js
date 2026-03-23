// message_reactions: emoji reactions placed by users on individual messages.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MessageReactionDocument
 * @property {string} id
 * @property {string} messageId - FK → messages
 * @property {string} userId - FK → users
 * @property {string} emoji
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMessageReaction(fields) {
  return {
    messageId: fields.messageId,
    userId: fields.userId,
    emoji: fields.emoji,
    createdAt: Timestamp.now(),
  };
}

export const messageReactionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      messageId: data.messageId,
      userId: data.userId,
      emoji: data.emoji,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - messageId   ASC
 *   - userId      ASC
 *
 * Composite indexes:
 *   - messageId ASC, userId ASC, emoji ASC  (enforces composite unique constraint)
 *   - messageId ASC, emoji ASC
 *   - userId ASC, createdAt DESC
 */
