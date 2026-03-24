// deal_activities: append-only audit trail of deal changes for pipeline analytics.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DEAL_ACTIVITY_ACTIONS = /** @type {const} */ ({
  CREATED: "created",
  UPDATED: "updated",
  STAGE_CHANGED: "stage_changed",
  WON: "won",
  LOST: "lost",
  REOPENED: "reopened",
});

/**
 * @typedef {Object} DealActivityDocument
 * @property {string} id
 * @property {string} dealId - FK → deals
 * @property {string | null} userId - FK → users
 * @property {typeof DEAL_ACTIVITY_ACTIONS[keyof typeof DEAL_ACTIVITY_ACTIONS]} action
 * @property {string | null} field
 * @property {string | null} oldValue
 * @property {string | null} newValue
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<DealActivityDocument, "id" | "createdAt">} fields
 * @returns {Omit<DealActivityDocument, "id">}
 */
export function createDealActivity(fields) {
  return {
    dealId: fields.dealId,
    userId: fields.userId ?? null,
    action: fields.action,
    field: fields.field ?? null,
    oldValue: fields.oldValue ?? null,
    newValue: fields.newValue ?? null,
    createdAt: Timestamp.now(),
  };
}

export const dealActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      dealId: data.dealId,
      userId: data.userId ?? null,
      action: data.action,
      field: data.field ?? null,
      oldValue: data.oldValue ?? null,
      newValue: data.newValue ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "deal_activities"
 *   - dealId ASC, createdAt DESC
 *   - userId ASC, createdAt DESC
 */
