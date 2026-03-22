// payment_sessions: Tracks payment attempts and provider state for each shopping cart.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PAYMENT_SESSION_STATUS = /** @type {const} */ ({
  PENDING:         "pending",
  AUTHORIZED:      "authorized",
  REQUIRES_ACTION: "requires_action",
  COMPLETED:       "completed",
  CANCELED:        "canceled",
  ERROR:           "error",
});

/**
 * @typedef {Object} PaymentSessionDocument
 * @property {string} id
 * @property {string} cartId - FK → carts
 * @property {string} provider
 * @property {string|null} providerId
 * @property {string} status
 * @property {number} amount
 * @property {string} currency
 * @property {Object|null} data
 * @property {boolean} isSelected
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createPaymentSession(fields) {
  return {
    cartId: fields.cartId,
    provider: fields.provider,
    providerId: fields.providerId ?? null,
    status: fields.status ?? "pending",
    amount: fields.amount,
    currency: fields.currency,
    data: fields.data ?? null,
    isSelected: fields.isSelected ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const paymentSessionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      cartId: data.cartId,
      provider: data.provider,
      providerId: data.providerId ?? null,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      data: data.data ?? null,
      isSelected: data.isSelected,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - payment_sessions: cartId ASC
  - payment_sessions: provider ASC, providerId ASC
  - payment_sessions: status ASC
*/
