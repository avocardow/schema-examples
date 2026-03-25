// tags: freeform labels that can be applied to tickets for filtering and reporting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TagDocument
 * @property {string} id
 * @property {string} name
 * @property {string | null} color
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TagDocument, "id" | "createdAt">} fields
 * @returns {Omit<TagDocument, "id">}
 */
export function createTag(fields) {
  return {
    name: fields.name,
    color: fields.color ?? null,
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
      id: snapshot.id,
      name: data.name,
      color: data.color ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tags"
 *   - name ASC (unique)
 */
