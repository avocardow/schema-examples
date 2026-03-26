// vendor_balances: Running financial balances for vendor earnings and payouts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} VendorBalanceDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} currency
 * @property {number} available
 * @property {number} pending
 * @property {number} totalEarned
 * @property {number} totalPaidOut
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorBalanceDocument, "id" | "updatedAt">} data
 * @returns {Omit<VendorBalanceDocument, "id">}
 */
export function createVendorBalance(data) {
  return {
    vendorId: data.vendorId,
    currency: data.currency,
    available: data.available ?? 0,
    pending: data.pending ?? 0,
    totalEarned: data.totalEarned ?? 0,
    totalPaidOut: data.totalPaidOut ?? 0,
    updatedAt: Timestamp.now(),
  };
}

export const vendorBalanceConverter = {
  toFirestore(balance) {
    const { id, ...data } = balance;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
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
// - vendorId ASC
