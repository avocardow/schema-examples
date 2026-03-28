// genres: music genre categories.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} GenreDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<GenreDocument, "id" | "createdAt">} fields
 * @returns {Omit<GenreDocument, "id">}
 */
export function createGenre(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    createdAt: Timestamp.now(),
  };
}

export const genreConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug ASC
 *   - name ASC
 */
