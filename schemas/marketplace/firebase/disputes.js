// disputes: Customer-vendor dispute cases with resolution tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DISPUTE_REASON = /** @type {const} */ ({
  NOT_RECEIVED: "not_received",
  NOT_AS_DESCRIBED: "not_as_described",
  DEFECTIVE: "defective",
  WRONG_ITEM: "wrong_item",
  UNAUTHORIZED: "unauthorized",
  OTHER: "other",
});

export const DISPUTE_STATUS = /** @type {const} */ ({
  OPEN: "open",
  UNDER_REVIEW: "under_review",
  ESCALATED: "escalated",
  RESOLVED_CUSTOMER: "resolved_customer",
  RESOLVED_VENDOR: "resolved_vendor",
  CLOSED: "closed",
});

/**
 * @typedef {Object} DisputeDocument
 * @property {string} id
 * @property {string} vendorOrderId - FK → vendor_orders
 * @property {string} customerId - FK → users
 * @property {string} vendorId - FK → vendors
 * @property {typeof DISPUTE_REASON[keyof typeof DISPUTE_REASON]} reason
 * @property {typeof DISPUTE_STATUS[keyof typeof DISPUTE_STATUS]} status
 * @property {string} description
 * @property {string|null} resolutionNote
 * @property {number|null} refundAmount
 * @property {string} currency
 * @property {string|null} resolvedBy - FK → users
 * @property {Timestamp|null} resolvedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<DisputeDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<DisputeDocument, "id">}
 */
export function createDispute(data) {
  return {
    vendorOrderId: data.vendorOrderId,
    customerId: data.customerId,
    vendorId: data.vendorId,
    reason: data.reason,
    status: data.status ?? DISPUTE_STATUS.OPEN,
    description: data.description,
    resolutionNote: data.resolutionNote ?? null,
    refundAmount: data.refundAmount ?? null,
    currency: data.currency,
    resolvedBy: data.resolvedBy ?? null,
    resolvedAt: data.resolvedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const disputeConverter = {
  toFirestore(dispute) {
    const { id, ...data } = dispute;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorOrderId: data.vendorOrderId,
      customerId: data.customerId,
      vendorId: data.vendorId,
      reason: data.reason,
      status: data.status,
      description: data.description,
      resolutionNote: data.resolutionNote ?? null,
      refundAmount: data.refundAmount ?? null,
      currency: data.currency,
      resolvedBy: data.resolvedBy ?? null,
      resolvedAt: data.resolvedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorOrderId ASC
// - customerId ASC
// - vendorId ASC, status ASC
// - status ASC
