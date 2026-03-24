// custom_fields: configurable intake form fields attached to services.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CUSTOM_FIELD_TYPES = /** @type {const} */ ({
  TEXT: "text",
  TEXTAREA: "textarea",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  CHECKBOX: "checkbox",
  NUMBER: "number",
  DATE: "date",
  PHONE: "phone",
  EMAIL: "email",
});

/**
 * @typedef {Object} CustomFieldDocument
 * @property {string} id
 * @property {string} serviceId - FK → services
 * @property {string} label
 * @property {typeof CUSTOM_FIELD_TYPES[keyof typeof CUSTOM_FIELD_TYPES]} fieldType
 * @property {string | null} placeholder
 * @property {boolean} isRequired
 * @property {Object | null} options
 * @property {number} position
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomFieldDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createCustomField(fields) {
  return {
    serviceId: fields.serviceId,
    label: fields.label,
    fieldType: fields.fieldType,
    placeholder: fields.placeholder ?? null,
    isRequired: fields.isRequired ?? false,
    options: fields.options ?? null,
    position: fields.position ?? 0,
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
      serviceId: data.serviceId,
      label: data.label,
      fieldType: data.fieldType,
      placeholder: data.placeholder ?? null,
      isRequired: data.isRequired,
      options: data.options ?? null,
      position: data.position,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - serviceId (ASC), position (ASC) — fields for a service in order
 * - serviceId (ASC), isActive (ASC), position (ASC) — active fields for a service
 */
