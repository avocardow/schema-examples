// categories: Hierarchical product categories with self-referencing parent support.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CategoryDocument
 * @property {string} id
 * @property {string|null} parentId - FK → categories (self-ref)
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {number} sortOrder
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CategoryDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<CategoryDocument, "id">}
 */
export function createCategory(data) {
  return {
    parentId: data.parentId ?? null,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const categoryConverter = {
  toFirestore(category) {
    const { id, ...data } = category;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      parentId: data.parentId ?? null,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - categories: parentId ASC
// - categories: slug ASC
// - categories: sortOrder ASC
