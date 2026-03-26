// event_series: Recurring event series grouping related events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventSeriesDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} recurrenceRule
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EventSeriesDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EventSeriesDocument, "id">}
 */
export function createEventSeries(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    recurrenceRule: fields.recurrenceRule ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const eventSeriesConverter = {
  /** @param {Omit<EventSeriesDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      recurrenceRule: data.recurrenceRule ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "event_series"
 *   - slug (ASC)
 *   - createdBy (ASC), createdAt (DESC)
 */
