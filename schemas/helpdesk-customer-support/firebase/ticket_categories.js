// ticket_categories: hierarchical groupings used to classify tickets by topic.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketCategoryDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} parentId - FK → ticket_categories
 * @property {number} sortOrder
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketCategoryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketCategoryDocument, "id">}
 */
export function createTicketCategory(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    parentId: fields.parentId ?? null,
    sortOrder: fields.sortOrder ?? 0,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketCategoryConverter = {
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
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_categories"
 *   - parentId ASC, sortOrder ASC
 */
