// metadata_schemas: Custom metadata field definitions per workspace.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const FIELD_TYPE = /** @type {const} */ ({
  TEXT:          "text",
  NUMBER:        "number",
  DATE:          "date",
  BOOLEAN:       "boolean",
  SINGLE_SELECT: "single_select",
  MULTI_SELECT:  "multi_select",
});

/**
 * @typedef {Object} MetadataSchemaDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string} fieldName
 * @property {string} fieldLabel
 * @property {typeof FIELD_TYPE[keyof typeof FIELD_TYPE]} fieldType
 * @property {Object|null} options
 * @property {boolean} isRequired
 * @property {number} displayOrder
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<MetadataSchemaDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<MetadataSchemaDocument, "id">}
 */
export function createMetadataSchema(fields) {
  return {
    workspaceId:  fields.workspaceId,
    fieldName:    fields.fieldName,
    fieldLabel:   fields.fieldLabel,
    fieldType:    fields.fieldType,
    options:      fields.options ?? null,
    isRequired:   fields.isRequired ?? false,
    displayOrder: fields.displayOrder ?? 0,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

export const metadataSchemaConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      workspaceId:  data.workspaceId,
      fieldName:    data.fieldName,
      fieldLabel:   data.fieldLabel,
      fieldType:    data.fieldType,
      options:      data.options ?? null,
      isRequired:   data.isRequired,
      displayOrder: data.displayOrder,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "metadata_schemas"
 *   - workspaceId ASC, displayOrder ASC
 *   - workspaceId ASC, fieldName ASC
 */
