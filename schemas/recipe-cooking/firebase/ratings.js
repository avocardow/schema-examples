// ratings: User ratings and optional reviews for recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RatingDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {string} userId - FK → users
 * @property {number} score
 * @property {string|null} review
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<RatingDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<RatingDocument, "id">}
 */
export function createRating(fields) {
  return {
    recipeId:  fields.recipeId,
    userId:    fields.userId,
    score:     fields.score,
    review:    fields.review ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ratingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      recipeId:  data.recipeId,
      userId:    data.userId,
      score:     data.score,
      review:    data.review ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ratings"
 *   - recipeId ASC, createdAt DESC
 *   - userId ASC, createdAt DESC
 *   - recipeId ASC, score DESC
 */
