// event_sessions: Individual sessions or talks within an event.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const SESSION_STATUSES = /** @type {const} */ ({
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
});

/**
 * @typedef {Object} EventSessionDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string | null} venueId - FK → venues
 * @property {string} title
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} startTime
 * @property {import("firebase/firestore").Timestamp} endTime
 * @property {string | null} track
 * @property {number | null} maxAttendees
 * @property {number} position
 * @property {typeof SESSION_STATUSES[keyof typeof SESSION_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EventSessionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EventSessionDocument, "id">}
 */
export function createEventSession(fields) {
  return {
    eventId: fields.eventId,
    venueId: fields.venueId ?? null,
    title: fields.title,
    description: fields.description ?? null,
    startTime: fields.startTime,
    endTime: fields.endTime,
    track: fields.track ?? null,
    maxAttendees: fields.maxAttendees ?? null,
    position: fields.position ?? 0,
    status: fields.status ?? SESSION_STATUSES.SCHEDULED,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const eventSessionConverter = {
  /** @param {Omit<EventSessionDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      venueId: data.venueId ?? null,
      title: data.title,
      description: data.description ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      track: data.track ?? null,
      maxAttendees: data.maxAttendees ?? null,
      position: data.position,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "event_sessions"
 *   - eventId (ASC), startTime (ASC)
 *   - eventId (ASC), track (ASC), position (ASC)
 *   - eventId (ASC), status (ASC)
 */
