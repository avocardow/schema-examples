// policy_versions: versioned policy content with approval workflow.

import { Timestamp } from "firebase/firestore";

export const POLICY_VERSION_STATUS = /** @type {const} */ ({
  DRAFT:    "draft",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  ARCHIVED: "archived",
});

/**
 * @typedef {Object} PolicyVersionDocument
 * @property {string}      id
 * @property {string}      policyId      - FK → policies
 * @property {string}      versionNumber
 * @property {string|null} content
 * @property {string|null} fileId        - FK → files
 * @property {typeof POLICY_VERSION_STATUS[keyof typeof POLICY_VERSION_STATUS]} status
 * @property {string|null} approvedBy    - FK → users
 * @property {import("firebase/firestore").Timestamp|null} approvedAt
 * @property {string|null} effectiveDate
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PolicyVersionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PolicyVersionDocument, "id">}
 */
export function createPolicyVersion(fields) {
  return {
    policyId:      fields.policyId,
    versionNumber: fields.versionNumber,
    content:       fields.content       ?? null,
    fileId:        fields.fileId        ?? null,
    status:        fields.status        ?? POLICY_VERSION_STATUS.DRAFT,
    approvedBy:    fields.approvedBy    ?? null,
    approvedAt:    fields.approvedAt    ?? null,
    effectiveDate: fields.effectiveDate ?? null,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const policyVersionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      policyId:      data.policyId,
      versionNumber: data.versionNumber,
      content:       data.content       ?? null,
      fileId:        data.fileId        ?? null,
      status:        data.status,
      approvedBy:    data.approvedBy    ?? null,
      approvedAt:    data.approvedAt    ?? null,
      effectiveDate: data.effectiveDate ?? null,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "policy_versions"
 *   - policyId ASC, versionNumber ASC (unique)
 *   - status ASC
 *   - approvedBy ASC
 */
