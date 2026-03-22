// translation_values: Translated string values for each key/locale combination.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TRANSLATION_VALUE_STATUS = /** @type {const} */ ({
  DRAFT:     "draft",
  IN_REVIEW: "in_review",
  APPROVED:  "approved",
  PUBLISHED: "published",
  REJECTED:  "rejected",
});

/**
 * @typedef {Object} TranslationValueDocument
 * @property {string}         id
 * @property {string}         translationKeyId
 * @property {string}         localeId
 * @property {string|null}    pluralCategory
 * @property {string}         value
 * @property {string}         status
 * @property {boolean}        isMachineTranslated
 * @property {string|null}    sourceDigest
 * @property {string|null}    translatorId
 * @property {string|null}    reviewedBy
 * @property {Timestamp|null} publishedAt
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Pick<TranslationValueDocument, "translationKeyId" | "localeId" | "value"> & Partial<Pick<TranslationValueDocument, "pluralCategory" | "status" | "isMachineTranslated" | "sourceDigest" | "translatorId" | "reviewedBy" | "publishedAt">>} fields
 * @returns {Omit<TranslationValueDocument, "id">}
 */
export function createTranslationValue(fields) {
  return {
    translationKeyId:    fields.translationKeyId,
    localeId:            fields.localeId,
    pluralCategory:      fields.pluralCategory      ?? null,
    value:               fields.value,
    status:              fields.status              ?? TRANSLATION_VALUE_STATUS.DRAFT,
    isMachineTranslated: fields.isMachineTranslated ?? false,
    sourceDigest:        fields.sourceDigest        ?? null,
    translatorId:        fields.translatorId        ?? null,
    reviewedBy:          fields.reviewedBy          ?? null,
    publishedAt:         fields.publishedAt         ?? null,
    createdAt:           Timestamp.now(),
    updatedAt:           Timestamp.now(),
  };
}

export const translationValueConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      translationKeyId:    data.translationKeyId,
      localeId:            data.localeId,
      pluralCategory:      data.pluralCategory      ?? null,
      value:               data.value,
      status:              data.status              ?? TRANSLATION_VALUE_STATUS.DRAFT,
      isMachineTranslated: data.isMachineTranslated ?? false,
      sourceDigest:        data.sourceDigest        ?? null,
      translatorId:        data.translatorId        ?? null,
      reviewedBy:          data.reviewedBy          ?? null,
      publishedAt:         data.publishedAt         ?? null,
      createdAt:           data.createdAt,
      updatedAt:           data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_values.translationKeyId ASC + translation_values.localeId ASC + translation_values.pluralCategory ASC
 *   - translation_values.localeId ASC + translation_values.status ASC
 *
 * Single-field:
 *   - translation_values.status       ASC
 *   - translation_values.translatorId ASC
 */
