// refunds: Tracks refund requests and outcomes against payments and orders.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const REFUND_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  SUCCEEDED: "succeeded",
  FAILED:    "failed",
});

/**
 * @typedef {Object} RefundDocument
 * @property {string} id
 * @property {string} paymentId - FK → payments
 * @property {string} orderId - FK → orders
 * @property {string|null} providerId
 * @property {number} amount
 * @property {string} currency
 * @property {string|null} reason
 * @property {string} status
 * @property {string|null} note
 * @property {string|null} refundedBy - FK → users
 * @property {Timestamp} createdAt
 */

export function createRefund(fields) {
  return {
    paymentId: fields.paymentId,
    orderId: fields.orderId,
    providerId: fields.providerId ?? null,
    amount: fields.amount,
    currency: fields.currency,
    reason: fields.reason ?? null,
    status: fields.status ?? "pending",
    note: fields.note ?? null,
    refundedBy: fields.refundedBy ?? null,
    createdAt: Timestamp.now(),
  };
}

export const refundConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      paymentId: data.paymentId,
      orderId: data.orderId,
      providerId: data.providerId ?? null,
      amount: data.amount,
      currency: data.currency,
      reason: data.reason ?? null,
      status: data.status,
      note: data.note ?? null,
      refundedBy: data.refundedBy ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - refunds: paymentId ASC
  - refunds: orderId ASC
  - refunds: status ASC
*/
