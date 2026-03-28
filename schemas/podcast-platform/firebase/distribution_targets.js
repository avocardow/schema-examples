// distribution_targets: External platform distribution status for shows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DISTRIBUTION_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
});

/**
 * @typedef {Object} DistributionTargetDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} platform
 * @property {string | null} externalId
 * @property {typeof DISTRIBUTION_STATUS[keyof typeof DISTRIBUTION_STATUS]} status
 * @property {string | null} feedUrlOverride
 * @property {import("firebase/firestore").Timestamp | null} submittedAt
 * @property {import("firebase/firestore").Timestamp | null} approvedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<DistributionTargetDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<DistributionTargetDocument, "id">}
 */
export function createDistributionTarget(fields) {
  return {
    showId: fields.showId,
    platform: fields.platform,
    externalId: fields.externalId ?? null,
    status: fields.status ?? DISTRIBUTION_STATUS.PENDING,
    feedUrlOverride: fields.feedUrlOverride ?? null,
    submittedAt: fields.submittedAt ?? null,
    approvedAt: fields.approvedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const distributionTargetConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      platform: data.platform,
      externalId: data.externalId ?? null,
      status: data.status,
      feedUrlOverride: data.feedUrlOverride ?? null,
      submittedAt: data.submittedAt ?? null,
      approvedAt: data.approvedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - status ASC
 *
 * Composite indexes:
 *   - showId ASC, platform ASC
 */
