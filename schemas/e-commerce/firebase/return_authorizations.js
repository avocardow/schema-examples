// return_authorizations: Manages RMA requests for order returns, tracking approval workflow and refund outcomes.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const RETURN_AUTHORIZATION_STATUS = /** @type {const} */ ({
  REQUESTED: "requested",
  APPROVED:  "approved",
  REJECTED:  "rejected",
  RECEIVED:  "received",
  REFUNDED:  "refunded",
  CANCELED:  "canceled",
});

/**
 * @typedef {Object} ReturnAuthorizationDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string} rmaNumber
 * @property {string} status
 * @property {string|null} reason
 * @property {string|null} note
 * @property {number|null} refundAmount
 * @property {string} currency
 * @property {string|null} requestedBy - FK → users
 * @property {string|null} approvedBy - FK → users
 * @property {Timestamp|null} receivedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createReturnAuthorization(fields) {
  return {
    orderId: fields.orderId,
    rmaNumber: fields.rmaNumber,
    status: fields.status ?? "requested",
    reason: fields.reason ?? null,
    note: fields.note ?? null,
    refundAmount: fields.refundAmount ?? null,
    currency: fields.currency,
    requestedBy: fields.requestedBy ?? null,
    approvedBy: fields.approvedBy ?? null,
    receivedAt: fields.receivedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const returnAuthorizationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      rmaNumber: data.rmaNumber,
      status: data.status,
      reason: data.reason ?? null,
      note: data.note ?? null,
      refundAmount: data.refundAmount ?? null,
      currency: data.currency,
      requestedBy: data.requestedBy ?? null,
      approvedBy: data.approvedBy ?? null,
      receivedAt: data.receivedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - return_authorizations: orderId ASC
  - return_authorizations: status ASC
  - return_authorizations: createdAt ASC
*/
