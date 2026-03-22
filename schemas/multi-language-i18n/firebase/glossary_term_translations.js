// glossary_term_translations: Locale-specific translations of glossary terms.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const GLOSSARY_TERM_STATUS = /** @type {const} */ ({
  DRAFT:    "draft",
  APPROVED: "approved",
});

/**
 * @typedef {Object} GlossaryTermTranslationDocument
 * @property {string}      id
 * @property {string}      termId
 * @property {string}      localeId
 * @property {string}      translation
 * @property {string|null} notes
 * @property {string}      status
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<GlossaryTermTranslationDocument, "termId" | "localeId" | "translation"> & Partial<Pick<GlossaryTermTranslationDocument, "notes" | "status">>} fields
 * @returns {Omit<GlossaryTermTranslationDocument, "id">}
 */
export function createGlossaryTermTranslation(fields) {
  return {
    termId:      fields.termId,
    localeId:    fields.localeId,
    translation: fields.translation,
    notes:       fields.notes  ?? null,
    status:      fields.status ?? GLOSSARY_TERM_STATUS.DRAFT,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const glossaryTermTranslationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      termId:      data.termId,
      localeId:    data.localeId,
      translation: data.translation,
      notes:       data.notes  ?? null,
      status:      data.status ?? GLOSSARY_TERM_STATUS.DRAFT,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - glossary_term_translations.termId ASC + glossary_term_translations.localeId ASC (unique)
 *
 * Single-field:
 *   - glossary_term_translations.localeId ASC
 */
