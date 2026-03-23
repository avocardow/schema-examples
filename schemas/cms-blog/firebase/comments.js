// comments: Threaded comments on posts with moderation support.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const COMMENT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SPAM: "spam",
});

/**
 * @typedef {Object} CommentDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string|null} parentId - FK → comments (self-referential)
 * @property {string|null} authorId - FK → users
 * @property {string} authorName
 * @property {string|null} authorEmail
 * @property {string} content
 * @property {string} status
 * @property {string|null} ipAddress
 * @property {string|null} userAgent
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createComment(fields) {
  return {
    postId: fields.postId,
    parentId: fields.parentId ?? null,
    authorId: fields.authorId ?? null,
    authorName: fields.authorName,
    authorEmail: fields.authorEmail ?? null,
    content: fields.content,
    status: fields.status ?? "pending",
    ipAddress: fields.ipAddress ?? null,
    userAgent: fields.userAgent ?? null,
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
      id: snapshot.id,
      postId: data.postId,
      parentId: data.parentId ?? null,
      authorId: data.authorId ?? null,
      authorName: data.authorName,
      authorEmail: data.authorEmail ?? null,
      content: data.content,
      status: data.status,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - comments: postId ASC, status ASC, createdAt ASC
  - comments: parentId ASC
  - comments: authorId ASC
*/
