// comments: Threaded discussion comments on assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CommentDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string|null} parentId - FK → comments
 * @property {string} body
 * @property {string} authorId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CommentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CommentDocument, "id">}
 */
export function createComment(fields) {
  return {
    assetId:   fields.assetId,
    parentId:  fields.parentId ?? null,
    body:      fields.body,
    authorId:  fields.authorId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const commentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      assetId:   data.assetId,
      parentId:  data.parentId ?? null,
      body:      data.body,
      authorId:  data.authorId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "comments"
 *   - assetId ASC, createdAt ASC
 *   - parentId ASC
 *   - authorId ASC
 */
