// payments: Payment transactions recorded against orders, tracking provider interactions and settlement state.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PAYMENT_TYPE = /** @type {const} */ ({
  AUTHORIZATION: "authorization",
  CAPTURE:       "capture",
  SALE:          "sale",
});

export const PAYMENT_TRANSACTION_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  SUCCEEDED: "succeeded",
  FAILED:    "failed",
  CANCELED:  "canceled",
});

/**
 * @typedef {Object} PaymentDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string|null} paymentMethodId - FK → payment_methods
 * @property {string} provider
 * @property {string|null} providerId
 * @property {string} type
 * @property {string} status
 * @property {string} currency
 * @property {number} amount
 * @property {number|null} providerFee
 * @property {Object|null} metadata
 * @property {string|null} errorMessage
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createPayment(fields) {
  return {
    orderId: fields.orderId,
    paymentMethodId: fields.paymentMethodId ?? null,
    provider: fields.provider,
    providerId: fields.providerId ?? null,
    type: fields.type,
    status: fields.status ?? "pending",
    currency: fields.currency,
    amount: fields.amount,
    providerFee: fields.providerFee ?? null,
    metadata: fields.metadata ?? null,
    errorMessage: fields.errorMessage ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const paymentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      paymentMethodId: data.paymentMethodId ?? null,
      provider: data.provider,
      providerId: data.providerId ?? null,
      type: data.type,
      status: data.status,
      currency: data.currency,
      amount: data.amount,
      providerFee: data.providerFee ?? null,
      metadata: data.metadata ?? null,
      errorMessage: data.errorMessage ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - payments: orderId ASC
  - payments: provider ASC, providerId ASC
  - payments: status ASC
*/
