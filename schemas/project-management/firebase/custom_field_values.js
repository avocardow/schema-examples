// custom_field_values: stored values for custom fields on individual tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CustomFieldValueDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string} customFieldId - FK → custom_fields
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
    taskId: fields.taskId,
    customFieldId: fields.customFieldId,
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
      taskId: data.taskId,
      customFieldId: data.customFieldId,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_field_values"
 *   - taskId ASC, customFieldId ASC (unique)
 *   - customFieldId ASC
 */
