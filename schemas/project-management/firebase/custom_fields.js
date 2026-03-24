// custom_fields: user-defined field definitions for extending task data.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CUSTOM_FIELD_TYPES = /** @type {const} */ ({
  TEXT: "text",
  NUMBER: "number",
  DATE: "date",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  CHECKBOX: "checkbox",
  URL: "url",
});

/**
 * @typedef {Object} CustomFieldDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} name
 * @property {typeof CUSTOM_FIELD_TYPES[keyof typeof CUSTOM_FIELD_TYPES]} fieldType
 * @property {string | null} description
 * @property {boolean} isRequired
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomFieldDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CustomFieldDocument, "id">}
 */
export function createCustomField(fields) {
  return {
    projectId: fields.projectId,
    name: fields.name,
    fieldType: fields.fieldType,
    description: fields.description ?? null,
    isRequired: fields.isRequired ?? false,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const customFieldConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      name: data.name,
      fieldType: data.fieldType,
      description: data.description ?? null,
      isRequired: data.isRequired,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_fields"
 *   - projectId ASC, position ASC
 */
