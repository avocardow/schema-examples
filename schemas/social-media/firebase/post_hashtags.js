// post_hashtags: join table linking posts to their hashtags.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PostHashtagDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} hashtagId - FK → hashtags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PostHashtagDocument, "id" | "createdAt">} fields
 * @returns {Omit<PostHashtagDocument, "id">}
 */
export function createPostHashtag(fields) {
  return {
    postId: fields.postId,
    hashtagId: fields.hashtagId,
    createdAt: Timestamp.now(),
  };
}

export const postHashtagConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      hashtagId: data.hashtagId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - postId    ASC
 *   - hashtagId ASC
 *
 * Composite indexes:
 *   - hashtagId ASC, createdAt DESC
 *   - postId ASC, hashtagId ASC
 */
