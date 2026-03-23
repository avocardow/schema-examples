// pinned_messages: tracks which messages have been pinned within a conversation.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PinnedMessageDocument
 * @property {string} id
 * @property {string} conversationId - FK → conversations
 * @property {string} messageId - FK → messages
 * @property {string} pinnedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} pinnedAt
 */

export function createPinnedMessage(fields) {
  return {
    conversationId: fields.conversationId,
    messageId: fields.messageId,
    pinnedBy: fields.pinnedBy,
    pinnedAt: Timestamp.now(),
  };
}

export const pinnedMessageConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      conversationId: data.conversationId,
      messageId: data.messageId,
      pinnedBy: data.pinnedBy,
      pinnedAt: data.pinnedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - conversationId  ASC
 *   - messageId       ASC
 *   - pinnedBy        ASC
 *
 * Composite indexes:
 *   - conversationId ASC, pinnedAt DESC
 *
 * Uniqueness constraint (conversationId + messageId) must be enforced
 * in application logic or via a transaction/security rule, as Firestore
 * has no native composite-unique constraint.
 */
