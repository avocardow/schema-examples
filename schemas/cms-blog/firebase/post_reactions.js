// post_reactions: User reactions on posts.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const REACTION_TYPE = /** @type {const} */ ({
  LIKE: "like",
  LOVE: "love",
  CLAP: "clap",
  INSIGHTFUL: "insightful",
  BOOKMARK: "bookmark",
});

/**
 * @typedef {Object} PostReactionDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} userId - FK → users
 * @property {string} reactionType
 * @property {Timestamp} createdAt
 */

export function createPostReaction(fields) {
  return {
    postId: fields.postId,
    userId: fields.userId,
    reactionType: fields.reactionType,
    createdAt: Timestamp.now(),
  };
}

export const postReactionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      userId: data.userId,
      reactionType: data.reactionType,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_reactions: postId ASC, userId ASC, reactionType ASC (unique)
  - post_reactions: userId ASC
  - post_reactions: postId ASC, reactionType ASC
*/
