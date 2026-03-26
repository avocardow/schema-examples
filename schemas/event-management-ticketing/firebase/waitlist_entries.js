// waitlist_entries: Users waiting for ticket availability on sold-out events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const WAITLIST_STATUSES = /** @type {const} */ ({
  WAITING: "waiting",
  NOTIFIED: "notified",
  CONVERTED: "converted",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} WaitlistEntryDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string | null} ticketTypeId - FK → ticket_types
 * @property {string | null} userId - FK → users
 * @property {string} name
 * @property {string} email
 * @property {number} quantity
 * @property {typeof WAITLIST_STATUSES[keyof typeof WAITLIST_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} notifiedAt
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<WaitlistEntryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<WaitlistEntryDocument, "id">}
 */
export function createWaitlistEntry(fields) {
  return {
    eventId: fields.eventId,
    ticketTypeId: fields.ticketTypeId ?? null,
    userId: fields.userId ?? null,
    name: fields.name,
    email: fields.email,
    quantity: fields.quantity ?? 1,
    status: fields.status ?? WAITLIST_STATUSES.WAITING,
    notifiedAt: fields.notifiedAt ?? null,
    expiresAt: fields.expiresAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const waitlistEntryConverter = {
  /** @param {Omit<WaitlistEntryDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      ticketTypeId: data.ticketTypeId ?? null,
      userId: data.userId ?? null,
      name: data.name,
      email: data.email,
      quantity: data.quantity,
      status: data.status,
      notifiedAt: data.notifiedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "waitlist_entries"
 *   - eventId (ASC), status (ASC), createdAt (ASC)
 *   - eventId (ASC), ticketTypeId (ASC), status (ASC)
 *   - userId (ASC), status (ASC)
 *   - email (ASC), eventId (ASC)
 */
