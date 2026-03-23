// posts: user-authored content including replies, quotes, and threaded conversations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const POST_CONTENT_TYPES = /** @type {const} */ ({
  TEXT: "text",
  SYSTEM: "system",
  DELETED: "deleted",
});

export const POST_VISIBILITIES = /** @type {const} */ ({
  PUBLIC: "public",
  UNLISTED: "unlisted",
  FOLLOWERS_ONLY: "followers_only",
  MENTIONED_ONLY: "mentioned_only",
});

/**
 * @typedef {Object} PostDocument
 * @property {string} id
 * @property {string} authorId - FK → users
 * @property {string | null} content
 * @property {typeof POST_CONTENT_TYPES[keyof typeof POST_CONTENT_TYPES]} contentType
 * @property {string | null} replyToId - FK → posts
 * @property {string | null} conversationId - FK → posts
 * @property {string | null} quoteOfId - FK → posts
 * @property {typeof POST_VISIBILITIES[keyof typeof POST_VISIBILITIES]} visibility
 * @property {boolean} isEdited
 * @property {import("firebase/firestore").Timestamp | null} editedAt
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {number} replyCount
 * @property {number} reactionCount
 * @property {number} repostCount
 * @property {string | null} pollId - FK → polls
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PostDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PostDocument, "id">}
 */
export function createPost(fields) {
  return {
    authorId: fields.authorId,
    content: fields.content ?? null,
    contentType: fields.contentType ?? POST_CONTENT_TYPES.TEXT,
    replyToId: fields.replyToId ?? null,
    conversationId: fields.conversationId ?? null,
    quoteOfId: fields.quoteOfId ?? null,
    visibility: fields.visibility ?? POST_VISIBILITIES.PUBLIC,
    isEdited: fields.isEdited ?? false,
    editedAt: fields.editedAt ?? null,
    expiresAt: fields.expiresAt ?? null,
    replyCount: fields.replyCount ?? 0,
    reactionCount: fields.reactionCount ?? 0,
    repostCount: fields.repostCount ?? 0,
    pollId: fields.pollId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const postConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      authorId: data.authorId,
      content: data.content ?? null,
      contentType: data.contentType,
      replyToId: data.replyToId ?? null,
      conversationId: data.conversationId ?? null,
      quoteOfId: data.quoteOfId ?? null,
      visibility: data.visibility,
      isEdited: data.isEdited,
      editedAt: data.editedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      replyCount: data.replyCount,
      reactionCount: data.reactionCount,
      repostCount: data.repostCount,
      pollId: data.pollId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - authorId       ASC
 *   - replyToId      ASC
 *   - conversationId ASC
 *   - quoteOfId      ASC
 *   - pollId         ASC
 *   - createdAt      DESC
 *
 * Composite indexes:
 *   - authorId ASC, createdAt DESC
 *   - visibility ASC, createdAt DESC
 *   - authorId ASC, visibility ASC, createdAt DESC
 *   - conversationId ASC, createdAt ASC
 */
