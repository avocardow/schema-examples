// collections: User-curated groups of recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CollectionDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} coverImageUrl
 * @property {boolean} isPublic
 * @property {number} recipeCount
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CollectionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CollectionDocument, "id">}
 */
export function createCollection(fields) {
  return {
    name:          fields.name,
    description:   fields.description ?? null,
    coverImageUrl: fields.coverImageUrl ?? null,
    isPublic:      fields.isPublic ?? false,
    recipeCount:   fields.recipeCount ?? 0,
    createdBy:     fields.createdBy,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const collectionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      name:          data.name,
      description:   data.description ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      isPublic:      data.isPublic,
      recipeCount:   data.recipeCount,
      createdBy:     data.createdBy,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "collections"
 *   - createdBy ASC, createdAt DESC
 *   - isPublic ASC, createdAt DESC
 */
