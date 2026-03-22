// translation_key_tags: Tags associated with translation keys for categorization.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationKeyTagDocument
 * @property {string}    id
 * @property {string}    translationKeyId
 * @property {string}    tag
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<TranslationKeyTagDocument, "translationKeyId" | "tag">} fields
 * @returns {Omit<TranslationKeyTagDocument, "id">}
 */
export function createTranslationKeyTag(fields) {
  return {
    translationKeyId: fields.translationKeyId,
    tag:              fields.tag,
    createdAt:        Timestamp.now(),
  };
}

export const translationKeyTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      translationKeyId: data.translationKeyId,
      tag:              data.tag,
      createdAt:        data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_key_tags.translationKeyId ASC + translation_key_tags.tag ASC (unique)
 *
 * Single-field:
 *   - translation_key_tags.tag ASC
 */
