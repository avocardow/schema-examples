// reviews: User ratings and reviews for shows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ReviewDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} showId - FK → shows
 * @property {number} rating
 * @property {string | null} title
 * @property {string | null} body
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ReviewDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ReviewDocument, "id">}
 */
export function createReview(fields) {
  return {
    userId: fields.userId,
    showId: fields.showId,
    rating: fields.rating,
    title: fields.title ?? null,
    body: fields.body ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const reviewConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      showId: data.showId,
      rating: data.rating,
      title: data.title ?? null,
      body: data.body ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - showId ASC, createdAt DESC
 *   - showId ASC, rating DESC
 *   - userId ASC, showId ASC
 */
