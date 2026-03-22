// translation_keys: Individual translatable string keys within namespaces.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationKeyDocument
 * @property {string}      id
 * @property {string}      namespaceId
 * @property {string}      key
 * @property {string|null} description
 * @property {number|null} maxLength
 * @property {boolean}     isPlural
 * @property {string}      format
 * @property {boolean}     isHidden
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<TranslationKeyDocument, "namespaceId" | "key"> & Partial<Pick<TranslationKeyDocument, "description" | "maxLength" | "isPlural" | "format" | "isHidden">>} fields
 * @returns {Omit<TranslationKeyDocument, "id">}
 */
export function createTranslationKey(fields) {
  return {
    namespaceId: fields.namespaceId,
    key:         fields.key,
    description: fields.description ?? null,
    maxLength:   fields.maxLength   ?? null,
    isPlural:    fields.isPlural    ?? false,
    format:      fields.format      ?? "text",
    isHidden:    fields.isHidden    ?? false,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const translationKeyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      namespaceId: data.namespaceId,
      key:         data.key,
      description: data.description ?? null,
      maxLength:   data.maxLength   ?? null,
      isPlural:    data.isPlural    ?? false,
      format:      data.format      ?? "text",
      isHidden:    data.isHidden    ?? false,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_keys.namespaceId ASC + translation_keys.key ASC (unique composite)
 *
 * Single-field:
 *   - translation_keys.isPlural ASC
 */
