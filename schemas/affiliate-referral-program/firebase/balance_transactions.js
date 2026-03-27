// balance_transactions: Ledger entries tracking affiliate balance changes with running totals.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const BALANCE_TRANSACTION_TYPE = /** @type {const} */ ({
  COMMISSION: "commission",
  PAYOUT: "payout",
  REVERSAL: "reversal",
  ADJUSTMENT: "adjustment",
});

/**
 * @typedef {Object} BalanceTransactionDocument
 * @property {string} id
 * @property {string} affiliateId - FK → affiliates
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
    affiliateId: data.affiliateId,
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
      affiliateId: data.affiliateId,
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

// Suggested Firestore indexes:
// - balance_transactions: affiliateId ASC, createdAt ASC
// - balance_transactions: type ASC
// - balance_transactions: referenceType ASC, referenceId ASC
