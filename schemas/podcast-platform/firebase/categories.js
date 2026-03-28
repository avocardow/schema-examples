// categories: Hierarchical taxonomy for classifying shows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CategoryDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} parentId - FK → categories
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CategoryDocument, "id" | "createdAt">} fields
 * @returns {Omit<CategoryDocument, "id">}
 */
export function createCategory(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    parentId: fields.parentId ?? null,
    createdAt: Timestamp.now(),
  };
}

export const categoryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug     ASC
 *   - parentId ASC
 */
