// ticket_statuses: lookup table defining the lifecycle states a ticket can occupy.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketStatusDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {number} sortOrder
 * @property {string | null} color
 * @property {boolean} isClosed
 * @property {boolean} isDefault
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketStatusDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketStatusDocument, "id">}
 */
export function createTicketStatus(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    sortOrder: fields.sortOrder ?? 0,
    color: fields.color ?? null,
    isClosed: fields.isClosed ?? false,
    isDefault: fields.isDefault ?? false,
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketStatusConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder,
      color: data.color ?? null,
      isClosed: data.isClosed,
      isDefault: data.isDefault,
      description: data.description ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_statuses"
 *   - sortOrder ASC
 */
