// conversations: direct messages, group chats, and channels between users.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONVERSATION_TYPES = /** @type {const} */ ({
  DIRECT: "direct",
  GROUP: "group",
  CHANNEL: "channel",
});

/**
 * @typedef {Object} ConversationDocument
 * @property {string} id
 * @property {typeof CONVERSATION_TYPES[keyof typeof CONVERSATION_TYPES]} type
 * @property {string | null} name
 * @property {string | null} description
 * @property {string | null} slug
 * @property {boolean} isPrivate
 * @property {boolean} isArchived
 * @property {import("firebase/firestore").Timestamp | null} lastMessageAt
 * @property {number} messageCount
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createConversation(fields) {
  return {
    type: fields.type,
    name: fields.name ?? null,
    description: fields.description ?? null,
    slug: fields.slug ?? null,
    isPrivate: fields.isPrivate ?? false,
    isArchived: fields.isArchived ?? false,
    lastMessageAt: fields.lastMessageAt ?? null,
    messageCount: fields.messageCount ?? 0,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const conversationConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type,
      name: data.name ?? null,
      description: data.description ?? null,
      slug: data.slug ?? null,
      isPrivate: data.isPrivate,
      isArchived: data.isArchived,
      lastMessageAt: data.lastMessageAt ?? null,
      messageCount: data.messageCount,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - type        ASC
 *   - createdBy   ASC
 *   - lastMessageAt DESC
 *
 * Composite indexes:
 *   - isPrivate ASC, type ASC
 *   - isPrivate ASC, lastMessageAt DESC
 *   - type ASC, lastMessageAt DESC
 *   - isArchived ASC, type ASC, lastMessageAt DESC
 */
