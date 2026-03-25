// kb_categories: hierarchical sections organizing knowledge-base articles.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} KbCategoryDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} parentId - FK → kb_categories
 * @property {number} sortOrder
 * @property {boolean} isPublished
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<KbCategoryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<KbCategoryDocument, "id">}
 */
export function createKbCategory(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    parentId: fields.parentId ?? null,
    sortOrder: fields.sortOrder ?? 0,
    isPublished: fields.isPublished ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const kbCategoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      parentId: data.parentId ?? null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "kb_categories"
 *   - parentId ASC, sortOrder ASC
 */
