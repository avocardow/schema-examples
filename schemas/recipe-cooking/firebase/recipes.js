// recipes: Core table storing recipe metadata and authorship.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const RECIPE_DIFFICULTY = /** @type {const} */ ({
  EASY:   "easy",
  MEDIUM: "medium",
  HARD:   "hard",
});

export const RECIPE_STATUS = /** @type {const} */ ({
  DRAFT:     "draft",
  PUBLISHED: "published",
  ARCHIVED:  "archived",
});

/**
 * @typedef {Object} RecipeDocument
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} sourceUrl
 * @property {string|null} sourceName
 * @property {string|null} servings
 * @property {number|null} prepTimeMinutes
 * @property {number|null} cookTimeMinutes
 * @property {number|null} totalTimeMinutes
 * @property {string|null} difficulty
 * @property {string} status
 * @property {string|null} language
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<RecipeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<RecipeDocument, "id">}
 */
export function createRecipe(fields) {
  return {
    title:            fields.title,
    slug:             fields.slug,
    description:      fields.description ?? null,
    sourceUrl:        fields.sourceUrl ?? null,
    sourceName:       fields.sourceName ?? null,
    servings:         fields.servings ?? null,
    prepTimeMinutes:  fields.prepTimeMinutes ?? null,
    cookTimeMinutes:  fields.cookTimeMinutes ?? null,
    totalTimeMinutes: fields.totalTimeMinutes ?? null,
    difficulty:       fields.difficulty ?? null,
    status:           fields.status ?? "draft",
    language:         fields.language ?? null,
    createdBy:        fields.createdBy,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

export const recipeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      title:            data.title,
      slug:             data.slug,
      description:      data.description ?? null,
      sourceUrl:        data.sourceUrl ?? null,
      sourceName:       data.sourceName ?? null,
      servings:         data.servings ?? null,
      prepTimeMinutes:  data.prepTimeMinutes ?? null,
      cookTimeMinutes:  data.cookTimeMinutes ?? null,
      totalTimeMinutes: data.totalTimeMinutes ?? null,
      difficulty:       data.difficulty ?? null,
      status:           data.status,
      language:         data.language ?? null,
      createdBy:        data.createdBy,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "recipes"
 *   - createdBy ASC, createdAt DESC
 *   - status ASC, createdAt DESC
 *   - slug ASC
 *   - difficulty ASC, status ASC
 */
