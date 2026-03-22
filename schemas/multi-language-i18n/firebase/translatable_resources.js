// translatable_resources: Resource types that support content translation.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslatableResourceDocument
 * @property {string}    id
 * @property {string}    resourceType
 * @property {string}    displayName
 * @property {string[]}  translatableFields
 * @property {string|null} description
 * @property {boolean}   isEnabled
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Pick<TranslatableResourceDocument, "resourceType" | "displayName" | "translatableFields"> & Partial<Pick<TranslatableResourceDocument, "description" | "isEnabled">>} fields
 * @returns {Omit<TranslatableResourceDocument, "id">}
 */
export function createTranslatableResource(fields) {
  return {
    resourceType:      fields.resourceType,
    displayName:       fields.displayName,
    translatableFields: fields.translatableFields,
    description:       fields.description ?? null,
    isEnabled:         fields.isEnabled   ?? true,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

export const translatableResourceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      resourceType:       data.resourceType,
      displayName:        data.displayName,
      translatableFields: data.translatableFields,
      description:        data.description ?? null,
      isEnabled:          data.isEnabled   ?? true,
      createdAt:          data.createdAt,
      updatedAt:          data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - translatable_resources.resourceType ASC (unique)
 */
