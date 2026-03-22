// translation_memory_entries: Reusable translation memory for source/target pairs.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationMemoryEntryDocument
 * @property {string}      id
 * @property {string}      sourceLocaleId
 * @property {string}      targetLocaleId
 * @property {string}      sourceText
 * @property {string}      targetText
 * @property {string}      sourceHash
 * @property {string|null} domain
 * @property {number|null} qualityScore
 * @property {number}      usageCount
 * @property {string}      source
 * @property {string|null} createdBy
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<TranslationMemoryEntryDocument, "sourceLocaleId" | "targetLocaleId" | "sourceText" | "targetText" | "sourceHash"> & Partial<Pick<TranslationMemoryEntryDocument, "domain" | "qualityScore" | "usageCount" | "source" | "createdBy">>} fields
 * @returns {Omit<TranslationMemoryEntryDocument, "id">}
 */
export function createTranslationMemoryEntry(fields) {
  return {
    sourceLocaleId: fields.sourceLocaleId,
    targetLocaleId: fields.targetLocaleId,
    sourceText:     fields.sourceText,
    targetText:     fields.targetText,
    sourceHash:     fields.sourceHash,
    domain:         fields.domain       ?? null,
    qualityScore:   fields.qualityScore ?? null,
    usageCount:     fields.usageCount   ?? 0,
    source:         fields.source       ?? "human",
    createdBy:      fields.createdBy    ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const translationMemoryEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      sourceLocaleId: data.sourceLocaleId,
      targetLocaleId: data.targetLocaleId,
      sourceText:     data.sourceText,
      targetText:     data.targetText,
      sourceHash:     data.sourceHash,
      domain:         data.domain       ?? null,
      qualityScore:   data.qualityScore ?? null,
      usageCount:     data.usageCount   ?? 0,
      source:         data.source       ?? "human",
      createdBy:      data.createdBy    ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_memory_entries.sourceLocaleId ASC + translation_memory_entries.targetLocaleId ASC + translation_memory_entries.sourceHash ASC
 *   - translation_memory_entries.sourceLocaleId ASC + translation_memory_entries.targetLocaleId ASC
 *
 * Single-field:
 *   - translation_memory_entries.domain ASC
 */
