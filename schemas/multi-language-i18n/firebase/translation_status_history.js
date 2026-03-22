// translation_status_history: Audit log of translation status changes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranslationStatusHistoryDocument
 * @property {string}      id
 * @property {string}      translationType
 * @property {string}      translationId
 * @property {string|null} fromStatus
 * @property {string}      toStatus
 * @property {string|null} changedBy
 * @property {string|null} comment
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<TranslationStatusHistoryDocument, "translationType" | "translationId" | "toStatus"> & Partial<Pick<TranslationStatusHistoryDocument, "fromStatus" | "changedBy" | "comment">>} fields
 * @returns {Omit<TranslationStatusHistoryDocument, "id">}
 */
export function createTranslationStatusHistory(fields) {
  return {
    translationType: fields.translationType,
    translationId:   fields.translationId,
    fromStatus:      fields.fromStatus ?? null,
    toStatus:        fields.toStatus,
    changedBy:       fields.changedBy  ?? null,
    comment:         fields.comment    ?? null,
    createdAt:       Timestamp.now(),
  };
}

export const translationStatusHistoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      translationType: data.translationType,
      translationId:   data.translationId,
      fromStatus:      data.fromStatus ?? null,
      toStatus:        data.toStatus,
      changedBy:       data.changedBy  ?? null,
      comment:         data.comment    ?? null,
      createdAt:       data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_status_history.translationType ASC + translation_status_history.translationId ASC
 *
 * Single-field:
 *   - translation_status_history.changedBy ASC
 */
