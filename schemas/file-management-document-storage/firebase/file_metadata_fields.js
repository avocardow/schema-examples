// file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_metadata_fields"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each field defines a key, a display label, a type (for application-level validation),
 * and optional constraints. Values are stored in file_metadata_values as text —
 * the fieldType guides validation, not storage.
 */

export const FILE_METADATA_FIELD_TYPE = /** @type {const} */ ({
  STRING:  "string",
  INTEGER: "integer",
  FLOAT:   "float",
  BOOLEAN: "boolean",
  DATE:    "date",
  URL:     "url",
  SELECT:  "select",
});

/**
 * @typedef {Object} FileMetadataFieldDocument
 * @property {string}      name         - Machine-readable key (e.g., "invoice_number", "project_code").
 * @property {string}      label        - Human-readable display name (e.g., "Invoice Number", "Project Code").
 * @property {string}      fieldType    - One of FILE_METADATA_FIELD_TYPE values.
 * @property {string|null} description  - Explain what this field is for or how to fill it in.
 * @property {boolean}     isRequired   - If true, every file must have a value for this field.
 * @property {string|null} defaultValue - Default value for new files. Stored as text.
 * @property {Array|null}  options      - For select-type fields: array of valid values. Null for non-select types.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<FileMetadataFieldDocument, "name" | "label" | "fieldType"> & Partial<Pick<FileMetadataFieldDocument, "description" | "isRequired" | "defaultValue" | "options">>} fields
 * @returns {Omit<FileMetadataFieldDocument, "id">}
 */
export function createFileMetadataField(fields) {
  return {
    name:         fields.name,
    label:        fields.label,
    fieldType:    fields.fieldType,
    description:  fields.description  ?? null,
    isRequired:   fields.isRequired   ?? false,
    defaultValue: fields.defaultValue ?? null,
    options:      fields.options      ?? null,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_metadata_fields").withConverter(fileMetadataFieldConverter)
 */
export const fileMetadataFieldConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      name:         data.name,
      label:        data.label,
      fieldType:    data.fieldType,
      description:  data.description  ?? null,
      isRequired:   data.isRequired   ?? false,
      defaultValue: data.defaultValue ?? null,
      options:      data.options      ?? null,
      createdAt:    data.createdAt,   // Timestamp
      updatedAt:    data.updatedAt,   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_metadata_fields.name  ASC  — Unique lookup by machine-readable key.
 */
