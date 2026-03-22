// fulfillments: Shipment lifecycle records linking orders to carriers with tracking and delivery state.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const FULFILLMENT_STATUS = /** @type {const} */ ({
  PENDING:    "pending",
  SHIPPED:    "shipped",
  IN_TRANSIT: "in_transit",
  DELIVERED:  "delivered",
  FAILED:     "failed",
  RETURNED:   "returned",
});

/**
 * @typedef {Object} FulfillmentDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string|null} providerId - FK → fulfillment_providers
 * @property {string|null} shippingMethodId - FK → shipping_methods
 * @property {string} status
 * @property {string|null} trackingNumber
 * @property {string|null} trackingUrl
 * @property {string|null} carrier
 * @property {Timestamp|null} shippedAt
 * @property {Timestamp|null} deliveredAt
 * @property {string|null} note
 * @property {string|null} createdBy - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createFulfillment(fields) {
  return {
    orderId: fields.orderId,
    providerId: fields.providerId ?? null,
    shippingMethodId: fields.shippingMethodId ?? null,
    status: fields.status ?? "pending",
    trackingNumber: fields.trackingNumber ?? null,
    trackingUrl: fields.trackingUrl ?? null,
    carrier: fields.carrier ?? null,
    shippedAt: fields.shippedAt ?? null,
    deliveredAt: fields.deliveredAt ?? null,
    note: fields.note ?? null,
    createdBy: fields.createdBy ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const fulfillmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      providerId: data.providerId ?? null,
      shippingMethodId: data.shippingMethodId ?? null,
      status: data.status,
      trackingNumber: data.trackingNumber ?? null,
      trackingUrl: data.trackingUrl ?? null,
      carrier: data.carrier ?? null,
      shippedAt: data.shippedAt ?? null,
      deliveredAt: data.deliveredAt ?? null,
      note: data.note ?? null,
      createdBy: data.createdBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - fulfillments: orderId ASC
  - fulfillments: providerId ASC
  - fulfillments: status ASC
  - fulfillments: trackingNumber ASC
*/
