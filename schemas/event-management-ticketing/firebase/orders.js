// orders: Ticket purchase orders with payment and status tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ORDER_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
});

export const ORDER_PAYMENT_STATUSES = /** @type {const} */ ({
  NOT_REQUIRED: "not_required",
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  FAILED: "failed",
});

/**
 * @typedef {Object} OrderDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string} userId - FK → users
 * @property {string | null} promoCodeId - FK → promo_codes
 * @property {number} subtotal - Integer amount in smallest currency unit (cents)
 * @property {number} discountAmount - Integer amount in smallest currency unit (cents)
 * @property {number} total - Integer amount in smallest currency unit (cents)
 * @property {string} currency
 * @property {typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES]} status
 * @property {typeof ORDER_PAYMENT_STATUSES[keyof typeof ORDER_PAYMENT_STATUSES]} paymentStatus
 * @property {string | null} paymentMethod
 * @property {string} buyerName
 * @property {string} buyerEmail
 * @property {import("firebase/firestore").Timestamp | null} cancelledAt
 * @property {import("firebase/firestore").Timestamp | null} refundedAt
 * @property {import("firebase/firestore").Timestamp | null} confirmedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<OrderDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<OrderDocument, "id">}
 */
export function createOrder(fields) {
  return {
    eventId: fields.eventId,
    userId: fields.userId,
    promoCodeId: fields.promoCodeId ?? null,
    subtotal: fields.subtotal ?? 0,
    discountAmount: fields.discountAmount ?? 0,
    total: fields.total ?? 0,
    currency: fields.currency ?? "USD",
    status: fields.status ?? ORDER_STATUSES.PENDING,
    paymentStatus: fields.paymentStatus ?? ORDER_PAYMENT_STATUSES.PENDING,
    paymentMethod: fields.paymentMethod ?? null,
    buyerName: fields.buyerName,
    buyerEmail: fields.buyerEmail,
    cancelledAt: fields.cancelledAt ?? null,
    refundedAt: fields.refundedAt ?? null,
    confirmedAt: fields.confirmedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const orderConverter = {
  /** @param {Omit<OrderDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      userId: data.userId,
      promoCodeId: data.promoCodeId ?? null,
      subtotal: data.subtotal,
      discountAmount: data.discountAmount,
      total: data.total,
      currency: data.currency,
      status: data.status,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod ?? null,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      cancelledAt: data.cancelledAt ?? null,
      refundedAt: data.refundedAt ?? null,
      confirmedAt: data.confirmedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "orders"
 *   - eventId (ASC), status (ASC), createdAt (DESC)
 *   - userId (ASC), createdAt (DESC)
 *   - eventId (ASC), paymentStatus (ASC)
 *   - promoCodeId (ASC)
 */
