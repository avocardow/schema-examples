// event_organizers: Users assigned to manage or staff an event.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ORGANIZER_ROLES = /** @type {const} */ ({
  OWNER: "owner",
  ADMIN: "admin",
  MODERATOR: "moderator",
  CHECK_IN_STAFF: "check_in_staff",
});

/**
 * @typedef {Object} EventOrganizerDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string} userId - FK → users
 * @property {typeof ORGANIZER_ROLES[keyof typeof ORGANIZER_ROLES]} role
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<EventOrganizerDocument, "id" | "createdAt">} fields
 * @returns {Omit<EventOrganizerDocument, "id">}
 */
export function createEventOrganizer(fields) {
  return {
    eventId: fields.eventId,
    userId: fields.userId,
    role: fields.role ?? ORGANIZER_ROLES.ADMIN,
    createdAt: Timestamp.now(),
  };
}

export const eventOrganizerConverter = {
  /** @param {Omit<EventOrganizerDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      userId: data.userId,
      role: data.role,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "event_organizers"
 *   - eventId (ASC), role (ASC)
 *   - userId (ASC), createdAt (DESC)
 */
