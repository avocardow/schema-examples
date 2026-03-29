// tags: Labels for categorizing and filtering recipes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TagDocument
 * @property {string} id
 * @property {string} name
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TagDocument, "id" | "createdAt">} fields
 * @returns {Omit<TagDocument, "id">}
 */
export function createTag(fields) {
  return {
    name:      fields.name,
    createdAt: Timestamp.now(),
  };
}

export const tagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      name:      data.name,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tags"
 *   - name ASC
 */
