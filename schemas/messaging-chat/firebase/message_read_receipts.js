// message_read_receipts: per-user delivery and read tracking for individual messages.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MessageReadReceiptDocument
 * @property {string} id
 * @property {string} messageId - FK → messages
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp | null} deliveredAt
 * @property {import("firebase/firestore").Timestamp | null} readAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMessageReadReceipt(fields) {
  return {
    messageId: fields.messageId,
    userId: fields.userId,
    deliveredAt: fields.deliveredAt ?? null,
    readAt: fields.readAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const messageReadReceiptConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      messageId: data.messageId,
      userId: data.userId,
      deliveredAt: data.deliveredAt ?? null,
      readAt: data.readAt ?? null,
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
 *   - messageId ASC, userId ASC  (enforces composite unique constraint)
 *   - userId ASC, readAt ASC
 */
