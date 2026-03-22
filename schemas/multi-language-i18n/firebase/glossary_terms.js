// glossary_terms: Domain-specific terminology for consistent translations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} GlossaryTermDocument
 * @property {string}      id
 * @property {string}      term
 * @property {string|null} description
 * @property {string|null} partOfSpeech
 * @property {string|null} domain
 * @property {string}      sourceLocaleId
 * @property {boolean}     isForbidden
 * @property {boolean}     isCaseSensitive
 * @property {string|null} notes
 * @property {string|null} createdBy
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<GlossaryTermDocument, "term" | "sourceLocaleId"> & Partial<Pick<GlossaryTermDocument, "description" | "partOfSpeech" | "domain" | "isForbidden" | "isCaseSensitive" | "notes" | "createdBy">>} fields
 * @returns {Omit<GlossaryTermDocument, "id">}
 */
export function createGlossaryTerm(fields) {
  return {
    term:            fields.term,
    description:     fields.description     ?? null,
    partOfSpeech:    fields.partOfSpeech    ?? null,
    domain:          fields.domain          ?? null,
    sourceLocaleId:  fields.sourceLocaleId,
    isForbidden:     fields.isForbidden     ?? false,
    isCaseSensitive: fields.isCaseSensitive ?? false,
    notes:           fields.notes           ?? null,
    createdBy:       fields.createdBy       ?? null,
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  };
}

export const glossaryTermConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      term:            data.term,
      description:     data.description     ?? null,
      partOfSpeech:    data.partOfSpeech    ?? null,
      domain:          data.domain          ?? null,
      sourceLocaleId:  data.sourceLocaleId,
      isForbidden:     data.isForbidden     ?? false,
      isCaseSensitive: data.isCaseSensitive ?? false,
      notes:           data.notes           ?? null,
      createdBy:       data.createdBy       ?? null,
      createdAt:       data.createdAt,
      updatedAt:       data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - glossary_terms.sourceLocaleId ASC + glossary_terms.term ASC
 *
 * Single-field:
 *   - glossary_terms.domain ASC
 */
