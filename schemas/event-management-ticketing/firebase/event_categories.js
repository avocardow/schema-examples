// event_categories: Hierarchical categories for organizing events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventCategoryDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} parentId - FK → event_categories
 * @property {number} position
 * @property {string | null} color
 * @property {string | null} icon
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EventCategoryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EventCategoryDocument, "id">}
 */
export function createEventCategory(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    parentId: fields.parentId ?? null,
    position: fields.position ?? 0,
    color: fields.color ?? null,
    icon: fields.icon ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const eventCategoryConverter = {
  /** @param {Omit<EventCategoryDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      parentId: data.parentId ?? null,
      position: data.position,
      color: data.color ?? null,
      icon: data.icon ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "event_categories"
 *   - parentId (ASC), position (ASC)
 *   - slug (ASC)
 *   - isActive (ASC), position (ASC)
 */
