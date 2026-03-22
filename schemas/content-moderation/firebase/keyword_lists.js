// keyword_lists: Managed word/phrase lists for auto-moderation.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "keyword_lists"
 * Document ID: Firestore auto-generated
 *
 * Managed collections of words, phrases, and patterns for auto-moderation rules.
 * A list can be a blocklist (block matching content), allowlist (override blocks),
 * or watchlist (flag for review without blocking). Lists can be shared across
 * multiple rules and managed independently.
 */

export const KEYWORD_LIST_TYPE = /** @type {const} */ ({
  BLOCKLIST: "blocklist",
  ALLOWLIST: "allowlist",
  WATCHLIST: "watchlist",
});

export const KEYWORD_LIST_SCOPE = /** @type {const} */ ({
  GLOBAL: "global",
  COMMUNITY: "community",
});

/**
 * @typedef {Object} KeywordListDocument
 * @property {string}      id
 * @property {string}      name          - List name (e.g., "Profanity — English", "Competitor URLs").
 * @property {string|null} description   - What this list contains and how it's used.
 * @property {typeof KEYWORD_LIST_TYPE[keyof typeof KEYWORD_LIST_TYPE]} listType
 * @property {typeof KEYWORD_LIST_SCOPE[keyof typeof KEYWORD_LIST_SCOPE]} scope
 * @property {string|null} scopeId       - Community ID. Null when scope = global.
 * @property {boolean}     isEnabled
 * @property {string}      createdBy     - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Pick<KeywordListDocument, "name" | "createdBy"> & Partial<Pick<KeywordListDocument, "description" | "listType" | "scope" | "scopeId" | "isEnabled">>} fields
 * @returns {Omit<KeywordListDocument, "id">}
 */
export function createKeywordList(fields) {
  return {
    name:        fields.name,
    description: fields.description ?? null,
    listType:    fields.listType    ?? KEYWORD_LIST_TYPE.BLOCKLIST,
    scope:       fields.scope       ?? KEYWORD_LIST_SCOPE.GLOBAL,
    scopeId:     fields.scopeId     ?? null,
    isEnabled:   fields.isEnabled   ?? true,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("keyword_lists").withConverter(keywordListConverter)
 */
export const keywordListConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      description: data.description ?? null,
      listType:    data.listType,
      scope:       data.scope,
      scopeId:     data.scopeId     ?? null,
      isEnabled:   data.isEnabled,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - keyword_lists.scope ASC, keyword_lists.scopeId ASC  — "All keyword lists for this community."
 *
 * Single-field:
 *   - keyword_lists.listType   ASC  — "All blocklists."
 *   - keyword_lists.isEnabled  ASC  — "All active lists."
 */
