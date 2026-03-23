// message_mentions: Tracks @mentions in messages for notification routing.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MENTION_TYPES = /** @type {const} */ ({
  USER: "user",
  CHANNEL: "channel",
  ALL: "all",
});

/**
 * @typedef {Object} MessageMentionDocument
 * @property {string} id
 * @property {string} messageId - FK → messages
 * @property {string | null} mentionedUserId - FK → users
 * @property {typeof MENTION_TYPES[keyof typeof MENTION_TYPES]} mentionType
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMessageMention(fields) {
  return {
    messageId: fields.messageId,
    mentionedUserId: fields.mentionedUserId ?? null,
    mentionType: fields.mentionType ?? MENTION_TYPES.USER,
    createdAt: Timestamp.now(),
  };
}

export const messageMentionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      messageId: data.messageId,
      mentionedUserId: data.mentionedUserId ?? null,
      mentionType: data.mentionType,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - messageId       ASC
 *   - mentionedUserId ASC
 *
 * Composite indexes:
 *   - messageId ASC, mentionType ASC
 *   - mentionedUserId ASC, createdAt DESC
 */
