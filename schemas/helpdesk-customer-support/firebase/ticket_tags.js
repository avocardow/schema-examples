// ticket_tags: join table associating tags with tickets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketTagDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string} tagId - FK → tags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketTagDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketTagDocument, "id">}
 */
export function createTicketTag(fields) {
  return {
    ticketId: fields.ticketId,
    tagId: fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const ticketTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      tagId: data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_tags"
 *   - ticketId ASC, tagId ASC (unique)
 *   - tagId ASC
 */
