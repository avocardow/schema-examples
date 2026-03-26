// policies: governance policies, standards, procedures, and guidelines.

import { Timestamp } from "firebase/firestore";

export const POLICY_TYPE = /** @type {const} */ ({
  POLICY:    "policy",
  STANDARD:  "standard",
  PROCEDURE: "procedure",
  GUIDELINE: "guideline",
});

export const REVIEW_FREQUENCY = /** @type {const} */ ({
  MONTHLY:       "monthly",
  QUARTERLY:     "quarterly",
  SEMI_ANNUALLY: "semi_annually",
  ANNUALLY:      "annually",
  BIENNIALLY:    "biennially",
});

/**
 * @typedef {Object} PolicyDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} ownerId        - FK → users
 * @property {string}      title
 * @property {typeof POLICY_TYPE[keyof typeof POLICY_TYPE]}           policyType
 * @property {string|null} description
 * @property {typeof REVIEW_FREQUENCY[keyof typeof REVIEW_FREQUENCY]} reviewFrequency
 * @property {string|null} nextReviewDate
 * @property {boolean}     isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PolicyDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PolicyDocument, "id">}
 */
export function createPolicy(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    ownerId:        fields.ownerId        ?? null,
    title:          fields.title,
    policyType:     fields.policyType     ?? POLICY_TYPE.POLICY,
    description:    fields.description    ?? null,
    reviewFrequency: fields.reviewFrequency ?? REVIEW_FREQUENCY.ANNUALLY,
    nextReviewDate: fields.nextReviewDate ?? null,
    isActive:       fields.isActive       ?? true,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const policyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      organizationId:  data.organizationId ?? null,
      ownerId:         data.ownerId        ?? null,
      title:           data.title,
      policyType:      data.policyType,
      description:     data.description    ?? null,
      reviewFrequency: data.reviewFrequency,
      nextReviewDate:  data.nextReviewDate ?? null,
      isActive:        data.isActive,
      createdAt:       data.createdAt,
      updatedAt:       data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "policies"
 *   - organizationId ASC, isActive ASC
 *   - ownerId ASC
 *   - policyType ASC
 */
