// payouts: Scheduled and completed vendor payment disbursements.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PAYOUT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELED: "canceled",
});

/**
 * @typedef {Object} PayoutDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} payoutNumber
 * @property {typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS]} status
 * @property {string} currency
 * @property {number} amount
 * @property {number} fee
 * @property {number} netAmount
 * @property {string|null} provider
 * @property {string|null} providerId
 * @property {Timestamp} periodStart
 * @property {Timestamp} periodEnd
 * @property {string|null} note
 * @property {Timestamp|null} completedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<PayoutDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<PayoutDocument, "id">}
 */
export function createPayout(data) {
  return {
    vendorId: data.vendorId,
    payoutNumber: data.payoutNumber,
    status: data.status ?? PAYOUT_STATUS.PENDING,
    currency: data.currency,
    amount: data.amount,
    fee: data.fee ?? 0,
    netAmount: data.netAmount,
    provider: data.provider ?? null,
    providerId: data.providerId ?? null,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    note: data.note ?? null,
    completedAt: data.completedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const payoutConverter = {
  toFirestore(payout) {
    const { id, ...data } = payout;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      payoutNumber: data.payoutNumber,
      status: data.status,
      currency: data.currency,
      amount: data.amount,
      fee: data.fee,
      netAmount: data.netAmount,
      provider: data.provider ?? null,
      providerId: data.providerId ?? null,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      note: data.note ?? null,
      completedAt: data.completedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, status ASC
// - status ASC
// - periodStart ASC, periodEnd ASC
