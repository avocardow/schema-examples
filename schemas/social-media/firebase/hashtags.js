// hashtags: unique hashtag names and their usage counts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} HashtagDocument
 * @property {string} id
 * @property {string} name
 * @property {number} postCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<HashtagDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<HashtagDocument, "id">}
 */
export function createHashtag(fields) {
  return {
    name: fields.name,
    postCount: fields.postCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const hashtagConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      postCount: data.postCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - name      ASC
 *   - postCount DESC
 *
 * Composite indexes:
 *   - postCount DESC, name ASC
 */
