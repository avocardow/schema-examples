// custom_fields: admin-defined field definitions extending tickets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CUSTOM_FIELD_TYPES = /** @type {const} */ ({
  TEXT: "text",
  NUMBER: "number",
  DATE: "date",
  DROPDOWN: "dropdown",
  CHECKBOX: "checkbox",
  TEXTAREA: "textarea",
  URL: "url",
  EMAIL: "email",
});

/**
 * @typedef {Object} CustomFieldDocument
 * @property {string} id
 * @property {string} name
 * @property {string} label
 * @property {typeof CUSTOM_FIELD_TYPES[keyof typeof CUSTOM_FIELD_TYPES]} fieldType
 * @property {number} sortOrder
 * @property {boolean} isRequired
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomFieldDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CustomFieldDocument, "id">}
 */
export function createCustomField(fields) {
  return {
    name: fields.name,
    label: fields.label,
    fieldType: fields.fieldType,
    sortOrder: fields.sortOrder ?? 0,
    isRequired: fields.isRequired ?? false,
    isActive: fields.isActive ?? true,
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
      name: data.name,
      label: data.label,
      fieldType: data.fieldType,
      sortOrder: data.sortOrder,
      isRequired: data.isRequired,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_fields"
 *   - name ASC (unique)
 *   - sortOrder ASC
 */
