// policy_acknowledgments: tracks user acknowledgment of policy versions.

import { Timestamp } from "firebase/firestore";

export const ACKNOWLEDGMENT_METHOD = /** @type {const} */ ({
  CLICK_THROUGH:        "click_through",
  ELECTRONIC_SIGNATURE: "electronic_signature",
  MANUAL:               "manual",
});

/**
 * @typedef {Object} PolicyAcknowledgmentDocument
 * @property {string}      id
 * @property {string}      policyVersionId - FK → policy_versions
 * @property {string}      userId          - FK → users
 * @property {import("firebase/firestore").Timestamp} acknowledgedAt
 * @property {typeof ACKNOWLEDGMENT_METHOD[keyof typeof ACKNOWLEDGMENT_METHOD]} method
 * @property {string|null} ipAddress
 * @property {string|null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PolicyAcknowledgmentDocument, "id" | "createdAt">} fields
 * @returns {Omit<PolicyAcknowledgmentDocument, "id">}
 */
export function createPolicyAcknowledgment(fields) {
  return {
    policyVersionId: fields.policyVersionId,
    userId:          fields.userId,
    acknowledgedAt:  fields.acknowledgedAt,
    method:          fields.method ?? ACKNOWLEDGMENT_METHOD.CLICK_THROUGH,
    ipAddress:       fields.ipAddress ?? null,
    notes:           fields.notes     ?? null,
    createdAt:       Timestamp.now(),
  };
}

export const policyAcknowledgmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      policyVersionId: data.policyVersionId,
      userId:          data.userId,
      acknowledgedAt:  data.acknowledgedAt,
      method:          data.method,
      ipAddress:       data.ipAddress ?? null,
      notes:           data.notes     ?? null,
      createdAt:       data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "policy_acknowledgments"
 *   - policyVersionId ASC, userId ASC (unique)
 *   - userId ASC
 *   - acknowledgedAt DESC
 */
