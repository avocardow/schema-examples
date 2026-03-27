// suppression_entries: Global email suppression list to prevent sending to bounced or complained addresses.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const SUPPRESSION_REASON = /** @type {const} */ ({
  HARD_BOUNCE: "hard_bounce",
  COMPLAINT: "complaint",
  MANUAL: "manual",
  LIST_UNSUBSCRIBE: "list_unsubscribe",
});

/**
 * @typedef {Object} SuppressionEntryDocument
 * @property {string} id
 * @property {string} email
 * @property {typeof SUPPRESSION_REASON[keyof typeof SUPPRESSION_REASON]} reason
 * @property {string|null} sourceCampaignId - FK → campaigns
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<SuppressionEntryDocument, "id" | "createdAt">} fields
 * @returns {Omit<SuppressionEntryDocument, "id">}
 */
export function createSuppressionEntry(fields) {
  return {
    email:            fields.email,
    reason:           fields.reason,
    sourceCampaignId: fields.sourceCampaignId ?? null,
    createdBy:        fields.createdBy        ?? null,
    createdAt:        Timestamp.now(),
  };
}

export const suppressionEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      email:            data.email,
      reason:           data.reason,
      sourceCampaignId: data.sourceCampaignId ?? null,
      createdBy:        data.createdBy        ?? null,
      createdAt:        data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - suppression_entries.email   ASC  — Unique lookup by email before sending.
 *   - suppression_entries.reason  ASC  — Filter suppression entries by reason.
 */
