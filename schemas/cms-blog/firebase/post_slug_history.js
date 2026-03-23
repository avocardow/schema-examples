// post_slug_history: Historical slug records for URL redirect support.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PostSlugHistoryDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} slug
 * @property {Timestamp} changedAt
 */

export function createPostSlugHistory(fields) {
  return {
    postId: fields.postId,
    slug: fields.slug,
    changedAt: Timestamp.now(),
  };
}

export const postSlugHistoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      slug: data.slug,
      changedAt: data.changedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - post_slug_history: slug ASC
  - post_slug_history: postId ASC, changedAt DESC
*/
