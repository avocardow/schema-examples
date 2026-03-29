// metadata_values: Stores custom metadata field values for assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MetadataValueDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string} schemaId - FK → metadata_schemas
 * @property {string} value
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<MetadataValueDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<MetadataValueDocument, "id">}
 */
export function createMetadataValue(fields) {
  return {
    assetId:   fields.assetId,
    schemaId:  fields.schemaId,
    value:     fields.value,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const metadataValueConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      assetId:   data.assetId,
      schemaId:  data.schemaId,
      value:     data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "metadata_values"
 *   - assetId ASC, schemaId ASC
 */
