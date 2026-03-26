// payout_items: Individual vendor order amounts included in a payout batch.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PayoutItemDocument
 * @property {string} id
 * @property {string} payoutId - FK → payouts
 * @property {string} vendorOrderId - FK → vendor_orders
 * @property {number} amount
 * @property {number} commission
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<PayoutItemDocument, "id" | "createdAt">} data
 * @returns {Omit<PayoutItemDocument, "id">}
 */
export function createPayoutItem(data) {
  return {
    payoutId: data.payoutId,
    vendorOrderId: data.vendorOrderId,
    amount: data.amount,
    commission: data.commission ?? 0,
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
      vendorOrderId: data.vendorOrderId,
      amount: data.amount,
      commission: data.commission,
      createdAt: data.createdAt,
    };
  },
};

// Suggested indexes:
// - payoutId ASC
// - payoutId ASC, vendorOrderId ASC
