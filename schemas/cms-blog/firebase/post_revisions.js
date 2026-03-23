// post_revisions: Version history for post content changes.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PostRevisionDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {number} revisionNumber
 * @property {string} title
 * @property {string|null} content
 * @property {string|null} excerpt
 * @property {string} createdBy - FK → users
 * @property {Timestamp} createdAt
 */

export function createPostRevision(fields) {
  return {
    postId: fields.postId,
    revisionNumber: fields.revisionNumber,
    title: fields.title,
    content: fields.content ?? null,
    excerpt: fields.excerpt ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
  };
}

export const postRevisionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      revisionNumber: data.revisionNumber,
      title: data.title,
      content: data.content ?? null,
      excerpt: data.excerpt ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_revisions: postId ASC, revisionNumber DESC
  - post_revisions: postId ASC, createdAt DESC
*/
