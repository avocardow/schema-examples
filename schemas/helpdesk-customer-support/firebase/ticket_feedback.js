// ticket_feedback: post-resolution satisfaction ratings left by customers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TICKET_FEEDBACK_RATINGS = /** @type {const} */ ({
  GOOD: "good",
  BAD: "bad",
});

/**
 * @typedef {Object} TicketFeedbackDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {typeof TICKET_FEEDBACK_RATINGS[keyof typeof TICKET_FEEDBACK_RATINGS]} rating
 * @property {string | null} comment
 * @property {string} createdById - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketFeedbackDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketFeedbackDocument, "id">}
 */
export function createTicketFeedback(fields) {
  return {
    ticketId: fields.ticketId,
    rating: fields.rating,
    comment: fields.comment ?? null,
    createdById: fields.createdById,
    createdAt: Timestamp.now(),
  };
}

export const ticketFeedbackConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      rating: data.rating,
      comment: data.comment ?? null,
      createdById: data.createdById,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_feedback"
 *   - ticketId ASC (unique)
 *   - rating ASC
 *   - createdById ASC
 */
