// custom_fields: user-defined field definitions scoped to a CRM entity type.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CRM_ENTITY_TYPES = /** @type {const} */ ({
  CONTACT: "contact",
  COMPANY: "company",
  DEAL: "deal",
  LEAD: "lead",
});

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
 * @property {typeof CRM_ENTITY_TYPES[keyof typeof CRM_ENTITY_TYPES]} entityType
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
    entityType: fields.entityType,
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
      entityType: data.entityType,
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
 *   - entityType ASC, position ASC
 *   - entityType ASC, name ASC (unique)
 */
