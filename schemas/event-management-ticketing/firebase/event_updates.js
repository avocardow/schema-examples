// event_updates: Announcements and updates posted to event attendees.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventUpdateDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string} authorId - FK → users
 * @property {string} title
 * @property {string} body
 * @property {boolean} isPublished
 * @property {boolean} isPinned
 * @property {import("firebase/firestore").Timestamp | null} publishedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EventUpdateDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EventUpdateDocument, "id">}
 */
export function createEventUpdate(fields) {
  return {
    eventId: fields.eventId,
    authorId: fields.authorId,
    title: fields.title,
    body: fields.body,
    isPublished: fields.isPublished ?? false,
    isPinned: fields.isPinned ?? false,
    publishedAt: fields.publishedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const eventUpdateConverter = {
  /** @param {Omit<EventUpdateDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      authorId: data.authorId,
      title: data.title,
      body: data.body,
      isPublished: data.isPublished,
      isPinned: data.isPinned,
      publishedAt: data.publishedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "event_updates"
 *   - eventId (ASC), isPublished (ASC), createdAt (DESC)
 *   - eventId (ASC), isPinned (DESC), createdAt (DESC)
 *   - authorId (ASC), createdAt (DESC)
 */
