// affiliate_balances: Running financial balances for affiliate earnings and payouts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AffiliateBalanceDocument
 * @property {string} id
 * @property {string} affiliateId - FK → affiliates
 * @property {string} currency
 * @property {number} available
 * @property {number} pending
 * @property {number} totalEarned
 * @property {number} totalPaidOut
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<AffiliateBalanceDocument, "id" | "updatedAt">} data
 * @returns {Omit<AffiliateBalanceDocument, "id">}
 */
export function createAffiliateBalance(data) {
  return {
    affiliateId: data.affiliateId,
    currency: data.currency,
    available: data.available ?? 0,
    pending: data.pending ?? 0,
    totalEarned: data.totalEarned ?? 0,
    totalPaidOut: data.totalPaidOut ?? 0,
    updatedAt: Timestamp.now(),
  };
}

export const affiliateBalanceConverter = {
  toFirestore(balance) {
    const { id, ...data } = balance;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      affiliateId: data.affiliateId,
      currency: data.currency,
      available: data.available,
      pending: data.pending,
      totalEarned: data.totalEarned,
      totalPaidOut: data.totalPaidOut,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - affiliateId ASC
