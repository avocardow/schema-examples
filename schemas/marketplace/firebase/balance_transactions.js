// balance_transactions: Immutable ledger of all vendor balance changes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const BALANCE_TRANSACTION_TYPE = /** @type {const} */ ({
  EARNING: "earning",
  COMMISSION: "commission",
  PAYOUT: "payout",
  REFUND: "refund",
  ADJUSTMENT: "adjustment",
  HOLD: "hold",
  RELEASE: "release",
});

/**
 * @typedef {Object} BalanceTransactionDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {typeof BALANCE_TRANSACTION_TYPE[keyof typeof BALANCE_TRANSACTION_TYPE]} type
 * @property {number} amount
 * @property {string} currency
 * @property {number} runningBalance
 * @property {string|null} referenceType
 * @property {string|null} referenceId
 * @property {string|null} description
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<BalanceTransactionDocument, "id" | "createdAt">} data
 * @returns {Omit<BalanceTransactionDocument, "id">}
 */
export function createBalanceTransaction(data) {
  return {
    vendorId: data.vendorId,
    type: data.type,
    amount: data.amount,
    currency: data.currency,
    runningBalance: data.runningBalance,
    referenceType: data.referenceType ?? null,
    referenceId: data.referenceId ?? null,
    description: data.description ?? null,
    createdAt: Timestamp.now(),
  };
}

export const balanceTransactionConverter = {
  toFirestore(transaction) {
    const { id, ...data } = transaction;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      runningBalance: data.runningBalance,
      referenceType: data.referenceType ?? null,
      referenceId: data.referenceId ?? null,
      description: data.description ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, createdAt DESC
// - type ASC
// - referenceType ASC, referenceId ASC
