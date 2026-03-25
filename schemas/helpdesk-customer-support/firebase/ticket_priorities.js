// ticket_priorities: lookup table defining urgency levels for tickets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketPriorityDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {number} sortOrder
 * @property {string | null} color
 * @property {boolean} isDefault
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketPriorityDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketPriorityDocument, "id">}
 */
export function createTicketPriority(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    sortOrder: fields.sortOrder ?? 0,
    color: fields.color ?? null,
    isDefault: fields.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketPriorityConverter = {
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
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_priorities"
 *   - sortOrder ASC
 */
