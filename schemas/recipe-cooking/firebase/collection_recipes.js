// collection_recipes: Join table linking recipes to collections with ordering.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CollectionRecipeDocument
 * @property {string} id
 * @property {string} collectionId - FK → collections
 * @property {string} recipeId - FK → recipes
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} addedAt
 */

/**
 * @param {Omit<CollectionRecipeDocument, "id" | "addedAt">} fields
 * @returns {Omit<CollectionRecipeDocument, "id">}
 */
export function createCollectionRecipe(fields) {
  return {
    collectionId: fields.collectionId,
    recipeId:     fields.recipeId,
    position:     fields.position ?? 0,
    addedAt:      Timestamp.now(),
  };
}

export const collectionRecipeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      collectionId: data.collectionId,
      recipeId:     data.recipeId,
      position:     data.position,
      addedAt:      data.addedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "collection_recipes"
 *   - collectionId ASC, position ASC
 *   - recipeId ASC
 */
