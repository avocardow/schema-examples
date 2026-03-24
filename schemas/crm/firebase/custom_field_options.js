// custom_field_options: selectable options for select/multi-select custom fields.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CustomFieldOptionDocument
 * @property {string} id
 * @property {string} customFieldId - FK → custom_fields
 * @property {string} value
 * @property {string | null} color
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CustomFieldOptionDocument, "id" | "createdAt">} fields
 * @returns {Omit<CustomFieldOptionDocument, "id">}
 */
export function createCustomFieldOption(fields) {
  return {
    customFieldId: fields.customFieldId,
    value: fields.value,
    color: fields.color ?? null,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const customFieldOptionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customFieldId: data.customFieldId,
      value: data.value,
      color: data.color ?? null,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_field_options"
 *   - customFieldId ASC, position ASC
 */
