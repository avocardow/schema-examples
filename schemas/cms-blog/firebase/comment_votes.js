// comment_votes: User votes on comments.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CommentVoteDocument
 * @property {string} id
 * @property {string} commentId - FK → comments
 * @property {string} userId - FK → users
 * @property {number} value
 * @property {Timestamp} createdAt
 */

export function createCommentVote(fields) {
  return {
    commentId: fields.commentId,
    userId: fields.userId,
    value: fields.value,
    createdAt: Timestamp.now(),
  };
}

export const commentVoteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      commentId: data.commentId,
      userId: data.userId,
      value: data.value,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - comment_votes: commentId ASC, userId ASC (unique)
  - comment_votes: userId ASC
*/
