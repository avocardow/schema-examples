// namespaces: Logical groupings for translation keys.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} NamespaceDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} description
 * @property {boolean}     isDefault
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<NamespaceDocument, "name"> & Partial<Pick<NamespaceDocument, "description" | "isDefault">>} fields
 * @returns {Omit<NamespaceDocument, "id">}
 */
export function createNamespace(fields) {
  return {
    name:        fields.name,
    description: fields.description ?? null,
    isDefault:   fields.isDefault   ?? false,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const namespaceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      description: data.description ?? null,
      isDefault:   data.isDefault   ?? false,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - namespaces.name ASC (unique)
 */
