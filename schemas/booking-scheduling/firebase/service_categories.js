// service_categories: hierarchical groupings for organizing bookable services.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ServiceCategoryDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} parentId - FK → service_categories
 * @property {number} position
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ServiceCategoryDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createServiceCategory(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    parentId: fields.parentId ?? null,
    position: fields.position ?? 0,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const serviceCategoryConverter = {
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
      position: data.position,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - slug (ASC) — unique slug lookups
 * - parentId (ASC), position (ASC) — child categories in order
 * - isActive (ASC), position (ASC) — active categories listing
 */
