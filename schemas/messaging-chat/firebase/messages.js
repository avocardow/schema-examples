// messages: individual messages within a conversation, with threading support.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONTENT_TYPES = /** @type {const} */ ({
  TEXT: "text",
  SYSTEM: "system",
  DELETED: "deleted",
});

/**
 * @typedef {Object} MessageDocument
 * @property {string} id
 * @property {string} conversationId - FK → conversations
 * @property {string | null} senderId - FK → users
 * @property {string | null} content
 * @property {typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES]} contentType
 * @property {string | null} parentMessageId - FK → messages
 * @property {number} replyCount
 * @property {import("firebase/firestore").Timestamp | null} lastReplyAt
 * @property {boolean} isEdited
 * @property {import("firebase/firestore").Timestamp | null} editedAt
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMessage(fields) {
  return {
    conversationId: fields.conversationId,
    senderId: fields.senderId ?? null,
    content: fields.content ?? null,
    contentType: fields.contentType ?? CONTENT_TYPES.TEXT,
    parentMessageId: fields.parentMessageId ?? null,
    replyCount: fields.replyCount ?? 0,
    lastReplyAt: fields.lastReplyAt ?? null,
    isEdited: fields.isEdited ?? false,
    editedAt: fields.editedAt ?? null,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const messageConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      conversationId: data.conversationId,
      senderId: data.senderId ?? null,
      content: data.content ?? null,
      contentType: data.contentType,
      parentMessageId: data.parentMessageId ?? null,
      replyCount: data.replyCount,
      lastReplyAt: data.lastReplyAt ?? null,
      isEdited: data.isEdited,
      editedAt: data.editedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - senderId          ASC
 *   - parentMessageId   ASC
 *   - expiresAt         ASC
 *
 * Composite indexes:
 *   - conversationId ASC, createdAt ASC
 *   - conversationId ASC, parentMessageId ASC
 */
