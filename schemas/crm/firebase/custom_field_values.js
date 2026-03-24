// custom_field_values: actual values stored for custom fields on specific entities.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CustomFieldValueDocument
 * @property {string} id
 * @property {string} customFieldId - FK → custom_fields
 * @property {string} entityId
 * @property {string} value
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomFieldValueDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CustomFieldValueDocument, "id">}
 */
export function createCustomFieldValue(fields) {
  return {
    customFieldId: fields.customFieldId,
    entityId: fields.entityId,
    value: fields.value,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const customFieldValueConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customFieldId: data.customFieldId,
      entityId: data.entityId,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_field_values"
 *   - customFieldId ASC, entityId ASC (unique)
 *   - entityId ASC, createdAt DESC
 */
