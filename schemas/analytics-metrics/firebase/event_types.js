// event_types: Registry of known event types.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EventTypeDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} category
 * @property {string}      displayName
 * @property {string|null} description
 * @property {boolean}     isActive
 * @property {Object|null} schema
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<EventTypeDocument, "name" | "displayName"> & Partial<Pick<EventTypeDocument, "category" | "description" | "isActive" | "schema">>} fields
 * @returns {Omit<EventTypeDocument, "id">}
 */
export function createEventType(fields) {
  return {
    name:        fields.name,
    category:    fields.category    ?? null,
    displayName: fields.displayName,
    description: fields.description ?? null,
    isActive:    fields.isActive    ?? true,
    schema:      fields.schema      ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const eventTypeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      category:    data.category    ?? null,
      displayName: data.displayName,
      description: data.description ?? null,
      isActive:    data.isActive,
      schema:      data.schema      ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - event_types.name       ASC
 *   - event_types.category   ASC
 *   - event_types.isActive   ASC
 */
