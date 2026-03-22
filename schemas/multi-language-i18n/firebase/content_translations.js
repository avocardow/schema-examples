// content_translations: Translations for dynamic content entities.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONTENT_TRANSLATION_STATUS = /** @type {const} */ ({
  DRAFT:     "draft",
  IN_REVIEW: "in_review",
  APPROVED:  "approved",
  PUBLISHED: "published",
  REJECTED:  "rejected",
});

/**
 * @typedef {Object} ContentTranslationDocument
 * @property {string}      id
 * @property {string}      resourceId
 * @property {string}      entityId
 * @property {string}      localeId
 * @property {string}      fieldName
 * @property {string}      value
 * @property {string}      status
 * @property {string|null} sourceDigest
 * @property {string|null} translatorId
 * @property {number}      version
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<ContentTranslationDocument, "resourceId" | "entityId" | "localeId" | "fieldName" | "value"> & Partial<Pick<ContentTranslationDocument, "status" | "sourceDigest" | "translatorId" | "version">>} fields
 * @returns {Omit<ContentTranslationDocument, "id">}
 */
export function createContentTranslation(fields) {
  return {
    resourceId:   fields.resourceId,
    entityId:     fields.entityId,
    localeId:     fields.localeId,
    fieldName:    fields.fieldName,
    value:        fields.value,
    status:       fields.status       ?? CONTENT_TRANSLATION_STATUS.DRAFT,
    sourceDigest: fields.sourceDigest ?? null,
    translatorId: fields.translatorId ?? null,
    version:      fields.version      ?? 1,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

export const contentTranslationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      resourceId:   data.resourceId,
      entityId:     data.entityId,
      localeId:     data.localeId,
      fieldName:    data.fieldName,
      value:        data.value,
      status:       data.status       ?? CONTENT_TRANSLATION_STATUS.DRAFT,
      sourceDigest: data.sourceDigest ?? null,
      translatorId: data.translatorId ?? null,
      version:      data.version      ?? 1,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - content_translations.resourceId ASC + content_translations.entityId ASC + content_translations.localeId ASC + content_translations.fieldName ASC
 *   - content_translations.resourceId ASC + content_translations.entityId ASC
 *
 * Single-field:
 *   - content_translations.localeId ASC
 *   - content_translations.status   ASC
 */
