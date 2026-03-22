// keyword_list_entries: Individual words/phrases in keyword lists.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "keyword_list_entries"
 * Document ID: Deterministic — `${listId}_${value}_${matchType}`
 *
 * Firestore has no composite unique constraint, so uniqueness on (listId, value, matchType)
 * is enforced via a deterministic document ID.
 */

export const KEYWORD_MATCH_TYPE = /** @type {const} */ ({
  EXACT:    "exact",
  CONTAINS: "contains",
  REGEX:    "regex",
});

/**
 * @typedef {Object} KeywordListEntryDocument
 * @property {string}  id
 * @property {string}  listId          - FK → keyword_lists
 * @property {string}  value           - The word, phrase, or pattern to match against.
 * @property {typeof KEYWORD_MATCH_TYPE[keyof typeof KEYWORD_MATCH_TYPE]} matchType
 * @property {boolean} isCaseSensitive - Whether matching is case-sensitive.
 * @property {string}  addedBy         - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * Returns a deterministic document ID for a (listId, value, matchType) triple.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} listId
 * @param {string} value
 * @param {string} matchType
 * @returns {string}
 */
export function keywordListEntryDocId(listId, value, matchType) {
  return `${listId}_${value}_${matchType}`;
}

/**
 * @param {{ listId: string; value: string; matchType?: string; isCaseSensitive?: boolean; addedBy: string }} fields
 * @returns {Omit<KeywordListEntryDocument, "id">}
 */
export function createKeywordListEntry(fields) {
  return {
    listId:          fields.listId,
    value:           fields.value,
    matchType:       fields.matchType ?? KEYWORD_MATCH_TYPE.EXACT,
    isCaseSensitive: fields.isCaseSensitive ?? false,
    addedBy:         fields.addedBy,
    createdAt:       Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("keyword_list_entries").withConverter(keywordListEntryConverter)
 */
export const keywordListEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      listId:          data.listId,
      value:           data.value,
      matchType:       data.matchType,
      isCaseSensitive: data.isCaseSensitive,
      addedBy:         data.addedBy,
      createdAt:       data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - keyword_list_entries.listId  ASC  — "All entries in this list."
 */
