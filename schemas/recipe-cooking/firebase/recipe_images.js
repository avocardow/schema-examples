// recipe_images: Photos associated with a recipe, with ordering and primary flag.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RecipeImageDocument
 * @property {string} id
 * @property {string} recipeId - FK → recipes
 * @property {string} imageUrl
 * @property {string|null} caption
 * @property {boolean} isPrimary
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<RecipeImageDocument, "id" | "createdAt">} fields
 * @returns {Omit<RecipeImageDocument, "id">}
 */
export function createRecipeImage(fields) {
  return {
    recipeId:  fields.recipeId,
    imageUrl:  fields.imageUrl,
    caption:   fields.caption ?? null,
    isPrimary: fields.isPrimary ?? false,
    position:  fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const recipeImageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      recipeId:  data.recipeId,
      imageUrl:  data.imageUrl,
      caption:   data.caption ?? null,
      isPrimary: data.isPrimary,
      position:  data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipe_images"
 *   - recipeId ASC, position ASC
 *   - recipeId ASC, isPrimary DESC
 */
