// payout_items: Individual commission line items included in a payout batch.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PayoutItemDocument
 * @property {string} id
 * @property {string} payoutId - FK → payouts
 * @property {string} commissionId - FK → commissions
 * @property {number} amount
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<PayoutItemDocument, "id" | "createdAt">} data
 * @returns {Omit<PayoutItemDocument, "id">}
 */
export function createPayoutItem(data) {
  return {
    payoutId: data.payoutId,
    commissionId: data.commissionId,
    amount: data.amount,
    createdAt: Timestamp.now(),
  };
}

export const payoutItemConverter = {
  toFirestore(item) {
    const { id, ...data } = item;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      payoutId: data.payoutId,
      commissionId: data.commissionId,
      amount: data.amount,
      createdAt: data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - payout_items: payoutId ASC, commissionId ASC (composite unique)
// - payout_items: commissionId ASC
