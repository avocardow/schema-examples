// mentions: user mentions (@mentions) within posts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MentionDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} mentionedUserId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<MentionDocument, "id" | "createdAt">} fields
 * @returns {Omit<MentionDocument, "id">}
 */
export function createMention(fields) {
  return {
    postId: fields.postId,
    mentionedUserId: fields.mentionedUserId,
    createdAt: Timestamp.now(),
  };
}

export const mentionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      mentionedUserId: data.mentionedUserId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - postId          ASC
 *   - mentionedUserId ASC
 *
 * Composite indexes:
 *   - mentionedUserId ASC, createdAt DESC
 */
