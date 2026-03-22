// appeals: User appeals against moderation actions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const APPEAL_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} AppealDocument
 * @property {string}         id                 - Document ID (from snapshot.id).
 * @property {string}         moderationActionId - FK → moderation_actions. The action being appealed.
 * @property {string}         appellantId        - FK → users. Who submitted the appeal.
 * @property {string}         appealText         - The user's explanation of why the action should be overturned.
 * @property {typeof APPEAL_STATUS[keyof typeof APPEAL_STATUS]} status
 * @property {string|null}    reviewerId         - FK → users. Moderator who reviewed the appeal. Null = pending.
 * @property {string|null}    reviewerNotes      - Internal notes on the appeal decision.
 * @property {Timestamp|null} reviewedAt         - When the appeal was decided. Null = pending.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Omit<AppealDocument, "id" | "createdAt">} fields
 * @returns {Omit<AppealDocument, "id">}
 */
export function createAppeal(fields) {
  return {
    moderationActionId: fields.moderationActionId,
    appellantId:        fields.appellantId,
    appealText:         fields.appealText,
    status:             fields.status ?? APPEAL_STATUS.PENDING,
    reviewerId:         fields.reviewerId    ?? null,
    reviewerNotes:      fields.reviewerNotes ?? null,
    reviewedAt:         fields.reviewedAt    ?? null,
    createdAt:          Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("appeals").withConverter(appealConverter)
 */
export const appealConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      moderationActionId: data.moderationActionId,
      appellantId:        data.appellantId,
      appealText:         data.appealText,
      status:             data.status,
      reviewerId:         data.reviewerId    ?? null,
      reviewerNotes:      data.reviewerNotes ?? null,
      reviewedAt:         data.reviewedAt    ?? null,
      createdAt:          data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field (unique):
 *   - appeals.moderationActionId ASC  — One appeal per action (enforce uniqueness in app logic).
 *
 * Single-field:
 *   - appeals.appellantId        ASC  — "All appeals by this user."
 *   - appeals.status             ASC  — "All pending appeals."
 *   - appeals.reviewerId         ASC  — "All appeals reviewed by this moderator."
 *   - appeals.createdAt          ASC  — Time-range queries and metrics.
 */
