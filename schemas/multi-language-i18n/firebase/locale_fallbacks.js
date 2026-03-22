// locale_fallbacks: Fallback chain configuration for locales.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LocaleFallbackDocument
 * @property {string}    id
 * @property {string}    localeId
 * @property {string}    fallbackLocaleId
 * @property {number}    priority
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Pick<LocaleFallbackDocument, "localeId" | "fallbackLocaleId"> & Partial<Pick<LocaleFallbackDocument, "priority">>} fields
 * @returns {Omit<LocaleFallbackDocument, "id">}
 */
export function createLocaleFallback(fields) {
  return {
    localeId:         fields.localeId,
    fallbackLocaleId: fields.fallbackLocaleId,
    priority:         fields.priority ?? 0,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

export const localeFallbackConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      localeId:         data.localeId,
      fallbackLocaleId: data.fallbackLocaleId,
      priority:         data.priority ?? 0,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - locale_fallbacks.localeId ASC + locale_fallbacks.fallbackLocaleId ASC
 *   - locale_fallbacks.localeId ASC + locale_fallbacks.priority ASC
 */
