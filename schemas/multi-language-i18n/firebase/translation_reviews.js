// translation_reviews: Review decisions on translations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TRANSLATION_REVIEW_ACTION = /** @type {const} */ ({
  APPROVE:         "approve",
  REJECT:          "reject",
  REQUEST_CHANGES: "request_changes",
});

/**
 * @typedef {Object} TranslationReviewDocument
 * @property {string}      id
 * @property {string}      translationType
 * @property {string}      translationId
 * @property {string}      reviewerId
 * @property {string}      action
 * @property {string|null} comment
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<TranslationReviewDocument, "translationType" | "translationId" | "reviewerId" | "action"> & Partial<Pick<TranslationReviewDocument, "comment">>} fields
 * @returns {Omit<TranslationReviewDocument, "id">}
 */
export function createTranslationReview(fields) {
  return {
    translationType: fields.translationType,
    translationId:   fields.translationId,
    reviewerId:      fields.reviewerId,
    action:          fields.action,
    comment:         fields.comment ?? null,
    createdAt:       Timestamp.now(),
  };
}

export const translationReviewConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      translationType: data.translationType,
      translationId:   data.translationId,
      reviewerId:      data.reviewerId,
      action:          data.action,
      comment:         data.comment ?? null,
      createdAt:       data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - translation_reviews.translationType ASC + translation_reviews.translationId ASC
 *
 * Single-field:
 *   - translation_reviews.reviewerId ASC
 */
