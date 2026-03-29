// recipe_favorites: Tracks which users have favorited which recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RecipeFavoriteDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<RecipeFavoriteDocument, "id" | "createdAt">} fields
 * @returns {Omit<RecipeFavoriteDocument, "id">}
 */
export function createRecipeFavorite(fields) {
  return {
    recipeId:  fields.recipeId,
    userId:    fields.userId,
    createdAt: Timestamp.now(),
  };
}

export const recipeFavoriteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      recipeId:  data.recipeId,
      userId:    data.userId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_favorites"
 *   - userId ASC, createdAt DESC
 *   - recipeId ASC, userId ASC
 */
