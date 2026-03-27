// payouts: Affiliate payout records tracking disbursements, fees, and completion status.
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
 * @property {string} affiliateId - FK → affiliates
 * @property {string} payoutNumber
 * @property {typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS]} status
 * @property {string} currency
 * @property {number} amount
 * @property {number} fee
 * @property {number} netAmount
 * @property {string|null} payoutMethod
 * @property {string|null} providerId
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
    affiliateId: data.affiliateId,
    payoutNumber: data.payoutNumber,
    status: data.status ?? PAYOUT_STATUS.PENDING,
    currency: data.currency,
    amount: data.amount,
    fee: data.fee ?? 0,
    netAmount: data.netAmount,
    payoutMethod: data.payoutMethod ?? null,
    providerId: data.providerId ?? null,
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
      affiliateId: data.affiliateId,
      payoutNumber: data.payoutNumber,
      status: data.status,
      currency: data.currency,
      amount: data.amount,
      fee: data.fee,
      netAmount: data.netAmount,
      payoutMethod: data.payoutMethod ?? null,
      providerId: data.providerId ?? null,
      note: data.note ?? null,
      completedAt: data.completedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - payouts: affiliateId ASC, status ASC
// - payouts: status ASC
// - payouts: createdAt ASC
