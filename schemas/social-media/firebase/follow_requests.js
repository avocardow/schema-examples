// follow_requests: pending, approved, or rejected follow requests for private accounts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const FOLLOW_REQUEST_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} FollowRequestDocument
 * @property {string} id
 * @property {string} requesterId - FK → users
 * @property {string} targetId - FK → users
 * @property {typeof FOLLOW_REQUEST_STATUSES[keyof typeof FOLLOW_REQUEST_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<FollowRequestDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FollowRequestDocument, "id">}
 */
export function createFollowRequest(fields) {
  return {
    requesterId: fields.requesterId,
    targetId: fields.targetId,
    status: fields.status ?? FOLLOW_REQUEST_STATUSES.PENDING,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const followRequestConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      requesterId: data.requesterId,
      targetId: data.targetId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - requesterId ASC
 *   - targetId    ASC
 *   - status      ASC
 *
 * Composite indexes:
 *   - targetId ASC, status ASC, createdAt DESC
 *   - requesterId ASC, status ASC, createdAt DESC
 */
