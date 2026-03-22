// orders: Customer purchase records with status tracking, payment state, and fulfillment progress.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const ORDER_STATUS = /** @type {const} */ ({
  PENDING:    "pending",
  CONFIRMED:  "confirmed",
  PROCESSING: "processing",
  SHIPPED:    "shipped",
  DELIVERED:  "delivered",
  CANCELED:   "canceled",
  REFUNDED:   "refunded",
});

export const ORDER_PAYMENT_STATUS = /** @type {const} */ ({
  UNPAID:             "unpaid",
  PARTIALLY_PAID:     "partially_paid",
  PAID:               "paid",
  PARTIALLY_REFUNDED: "partially_refunded",
  REFUNDED:           "refunded",
});

export const ORDER_FULFILLMENT_STATUS = /** @type {const} */ ({
  UNFULFILLED:         "unfulfilled",
  PARTIALLY_FULFILLED: "partially_fulfilled",
  FULFILLED:           "fulfilled",
});

/**
 * @typedef {Object} OrderDocument
 * @property {string} id
 * @property {string} orderNumber
 * @property {string|null} userId - FK → users
 * @property {string} email
 * @property {string} status
 * @property {string} currency
 * @property {number} subtotal
 * @property {number} discountTotal
 * @property {number} taxTotal
 * @property {number} shippingTotal
 * @property {number} grandTotal
 * @property {string} paymentStatus
 * @property {string} fulfillmentStatus
 * @property {string|null} shippingName
 * @property {string|null} shippingAddressLine1
 * @property {string|null} shippingAddressLine2
 * @property {string|null} shippingCity
 * @property {string|null} shippingRegion
 * @property {string|null} shippingPostalCode
 * @property {string|null} shippingCountry
 * @property {string|null} shippingPhone
 * @property {string|null} billingName
 * @property {string|null} billingAddressLine1
 * @property {string|null} billingAddressLine2
 * @property {string|null} billingCity
 * @property {string|null} billingRegion
 * @property {string|null} billingPostalCode
 * @property {string|null} billingCountry
 * @property {string|null} discountCode
 * @property {string|null} note
 * @property {Timestamp|null} canceledAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createOrder(fields) {
  return {
    orderNumber: fields.orderNumber,
    userId: fields.userId ?? null,
    email: fields.email,
    status: fields.status ?? "pending",
    currency: fields.currency,
    subtotal: fields.subtotal,
    discountTotal: fields.discountTotal ?? 0,
    taxTotal: fields.taxTotal ?? 0,
    shippingTotal: fields.shippingTotal ?? 0,
    grandTotal: fields.grandTotal,
    paymentStatus: fields.paymentStatus ?? "unpaid",
    fulfillmentStatus: fields.fulfillmentStatus ?? "unfulfilled",
    shippingName: fields.shippingName ?? null,
    shippingAddressLine1: fields.shippingAddressLine1 ?? null,
    shippingAddressLine2: fields.shippingAddressLine2 ?? null,
    shippingCity: fields.shippingCity ?? null,
    shippingRegion: fields.shippingRegion ?? null,
    shippingPostalCode: fields.shippingPostalCode ?? null,
    shippingCountry: fields.shippingCountry ?? null,
    shippingPhone: fields.shippingPhone ?? null,
    billingName: fields.billingName ?? null,
    billingAddressLine1: fields.billingAddressLine1 ?? null,
    billingAddressLine2: fields.billingAddressLine2 ?? null,
    billingCity: fields.billingCity ?? null,
    billingRegion: fields.billingRegion ?? null,
    billingPostalCode: fields.billingPostalCode ?? null,
    billingCountry: fields.billingCountry ?? null,
    discountCode: fields.discountCode ?? null,
    note: fields.note ?? null,
    canceledAt: fields.canceledAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const orderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderNumber: data.orderNumber,
      userId: data.userId ?? null,
      email: data.email,
      status: data.status,
      currency: data.currency,
      subtotal: data.subtotal,
      discountTotal: data.discountTotal,
      taxTotal: data.taxTotal,
      shippingTotal: data.shippingTotal,
      grandTotal: data.grandTotal,
      paymentStatus: data.paymentStatus,
      fulfillmentStatus: data.fulfillmentStatus,
      shippingName: data.shippingName ?? null,
      shippingAddressLine1: data.shippingAddressLine1 ?? null,
      shippingAddressLine2: data.shippingAddressLine2 ?? null,
      shippingCity: data.shippingCity ?? null,
      shippingRegion: data.shippingRegion ?? null,
      shippingPostalCode: data.shippingPostalCode ?? null,
      shippingCountry: data.shippingCountry ?? null,
      shippingPhone: data.shippingPhone ?? null,
      billingName: data.billingName ?? null,
      billingAddressLine1: data.billingAddressLine1 ?? null,
      billingAddressLine2: data.billingAddressLine2 ?? null,
      billingCity: data.billingCity ?? null,
      billingRegion: data.billingRegion ?? null,
      billingPostalCode: data.billingPostalCode ?? null,
      billingCountry: data.billingCountry ?? null,
      discountCode: data.discountCode ?? null,
      note: data.note ?? null,
      canceledAt: data.canceledAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - orders: userId ASC
  - orders: status ASC
  - orders: paymentStatus ASC
  - orders: fulfillmentStatus ASC
  - orders: createdAt ASC
*/
