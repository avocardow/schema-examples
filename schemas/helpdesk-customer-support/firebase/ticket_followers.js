// ticket_followers: users subscribed to updates on a specific ticket.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketFollowerDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketFollowerDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketFollowerDocument, "id">}
 */
export function createTicketFollower(fields) {
  return {
    ticketId: fields.ticketId,
    userId: fields.userId,
    createdAt: Timestamp.now(),
  };
}

export const ticketFollowerConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_followers"
 *   - ticketId ASC, userId ASC (unique)
 *   - userId ASC
 */
