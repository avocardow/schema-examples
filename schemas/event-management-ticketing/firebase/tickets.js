// tickets: Individual issued tickets tied to order items and attendees.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TICKET_STATUSES = /** @type {const} */ ({
  VALID: "valid",
  USED: "used",
  CANCELLED: "cancelled",
  TRANSFERRED: "transferred",
  EXPIRED: "expired",
});

/**
 * @typedef {Object} TicketDocument
 * @property {string} id
 * @property {string} orderItemId - FK → order_items
 * @property {string} eventId - FK → events
 * @property {string | null} ticketTypeId - FK → ticket_types
 * @property {string | null} holderUserId - FK → users
 * @property {string} holderName
 * @property {string} holderEmail
 * @property {string} ticketCode
 * @property {typeof TICKET_STATUSES[keyof typeof TICKET_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} checkedInAt
 * @property {import("firebase/firestore").Timestamp | null} cancelledAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketDocument, "id">}
 */
export function createTicket(fields) {
  return {
    orderItemId: fields.orderItemId,
    eventId: fields.eventId,
    ticketTypeId: fields.ticketTypeId ?? null,
    holderUserId: fields.holderUserId ?? null,
    holderName: fields.holderName,
    holderEmail: fields.holderEmail,
    ticketCode: fields.ticketCode,
    status: fields.status ?? TICKET_STATUSES.VALID,
    checkedInAt: fields.checkedInAt ?? null,
    cancelledAt: fields.cancelledAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketConverter = {
  /** @param {Omit<TicketDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderItemId: data.orderItemId,
      eventId: data.eventId,
      ticketTypeId: data.ticketTypeId ?? null,
      holderUserId: data.holderUserId ?? null,
      holderName: data.holderName,
      holderEmail: data.holderEmail,
      ticketCode: data.ticketCode,
      status: data.status,
      checkedInAt: data.checkedInAt ?? null,
      cancelledAt: data.cancelledAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tickets"
 *   - eventId (ASC), status (ASC)
 *   - ticketCode (ASC)
 *   - holderUserId (ASC), status (ASC)
 *   - orderItemId (ASC)
 *   - eventId (ASC), checkedInAt (ASC)
 */
