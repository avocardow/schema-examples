// translation_groups: Groups of content translations for a single entity.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationGroupDocument
 * @property {string}    id
 * @property {string}    resourceId
 * @property {string}    entityId
 * @property {string}    sourceLocaleId
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Pick<TranslationGroupDocument, "resourceId" | "entityId" | "sourceLocaleId">} fields
 * @returns {Omit<TranslationGroupDocument, "id">}
 */
export function createTranslationGroup(fields) {
  return {
    resourceId:     fields.resourceId,
    entityId:       fields.entityId,
    sourceLocaleId: fields.sourceLocaleId,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const translationGroupConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      resourceId:     data.resourceId,
      entityId:       data.entityId,
      sourceLocaleId: data.sourceLocaleId,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_groups.resourceId ASC + translation_groups.entityId ASC (unique)
 *
 * Single-field:
 *   - translation_groups.sourceLocaleId ASC
 */
