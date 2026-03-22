// event_properties: Key-value properties for events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventPropertyDocument
 * @property {string}    id
 * @property {string}    eventId  - FK → events
 * @property {string}    key
 * @property {string}    value
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<EventPropertyDocument, "eventId" | "key" | "value">} fields
 * @returns {Omit<EventPropertyDocument, "id">}
 */
export function createEventProperty(fields) {
  return {
    eventId:   fields.eventId,
    key:       fields.key,
    value:     fields.value,
    createdAt: Timestamp.now(),
  };
}

export const eventPropertyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      eventId:   data.eventId,
      key:       data.key,
      value:     data.value,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - event_properties.eventId ASC
 *   - event_properties.key     ASC
 *
 * Composite:
 *   - event_properties.eventId ASC, event_properties.key ASC
 */
