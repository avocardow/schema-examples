// file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_metadata_values"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each document stores one metadata field's value for one file. All values are stored
 * as text — the corresponding file_metadata_fields.field_type determines how the
 * application validates and displays the value.
 *
 * Uniqueness: One value per field per file.
 * Enforce unique(fileId, fieldId) at the application layer since Firestore has no
 * native unique constraints.
 */

/**
 * @typedef {Object} FileMetadataValueDocument
 * @property {string}      fileId    - Reference to the file this metadata belongs to. Cascade-delete when the file is deleted.
 * @property {string}      fieldId   - Reference to the metadata field definition. Cascade-delete when the field is deleted.
 * @property {string|null} value     - The actual value, stored as text regardless of field_type. Null means "explicitly empty".
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<FileMetadataValueDocument, "fileId" | "fieldId"> & Partial<Pick<FileMetadataValueDocument, "value">>} fields
 * @returns {Omit<FileMetadataValueDocument, "id">}
 */
export function createFileMetadataValue(fields) {
  return {
    fileId:    fields.fileId,
    fieldId:   fields.fieldId,
    value:     fields.value ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_metadata_values").withConverter(fileMetadataValueConverter)
 */
export const fileMetadataValueConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      fileId:    data.fileId,
      fieldId:   data.fieldId,
      value:     data.value ?? null,
      createdAt: data.createdAt,  // Timestamp
      updatedAt: data.updatedAt,  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_metadata_values.fileId   ASC  — "All metadata values for this file."
 *   - file_metadata_values.fieldId  ASC  — "All values for this metadata field."
 *
 * Composite:
 *   - file_metadata_values.fieldId + value  ASC  — "All files where invoice_number = 'INV-2024-001'."
 *
 * Uniqueness:
 *   Enforce unique(fileId, fieldId) at the application layer.
 */
