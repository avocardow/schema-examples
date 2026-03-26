// vendor_orders: Per-vendor order splits with fulfillment status and financial breakdown.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_ORDER_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  REFUNDED: "refunded",
});

/**
 * @typedef {Object} VendorOrderDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string} vendorId - FK → vendors
 * @property {string} vendorOrderNumber
 * @property {typeof VENDOR_ORDER_STATUS[keyof typeof VENDOR_ORDER_STATUS]} status
 * @property {string} currency
 * @property {number} subtotal
 * @property {number} shippingTotal
 * @property {number} taxTotal
 * @property {number} discountTotal
 * @property {number} total
 * @property {number} commissionAmount
 * @property {number} vendorEarning
 * @property {string|null} note
 * @property {Timestamp|null} shippedAt
 * @property {Timestamp|null} deliveredAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorOrderDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorOrderDocument, "id">}
 */
export function createVendorOrder(data) {
  return {
    orderId: data.orderId,
    vendorId: data.vendorId,
    vendorOrderNumber: data.vendorOrderNumber,
    status: data.status ?? VENDOR_ORDER_STATUS.PENDING,
    currency: data.currency,
    subtotal: data.subtotal,
    shippingTotal: data.shippingTotal ?? 0,
    taxTotal: data.taxTotal ?? 0,
    discountTotal: data.discountTotal ?? 0,
    total: data.total,
    commissionAmount: data.commissionAmount ?? 0,
    vendorEarning: data.vendorEarning ?? 0,
    note: data.note ?? null,
    shippedAt: data.shippedAt ?? null,
    deliveredAt: data.deliveredAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorOrderConverter = {
  toFirestore(order) {
    const { id, ...data } = order;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      vendorId: data.vendorId,
      vendorOrderNumber: data.vendorOrderNumber,
      status: data.status,
      currency: data.currency,
      subtotal: data.subtotal,
      shippingTotal: data.shippingTotal,
      taxTotal: data.taxTotal,
      discountTotal: data.discountTotal,
      total: data.total,
      commissionAmount: data.commissionAmount,
      vendorEarning: data.vendorEarning,
      note: data.note ?? null,
      shippedAt: data.shippedAt ?? null,
      deliveredAt: data.deliveredAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - orderId ASC
// - vendorId ASC, status ASC
// - status ASC
// - createdAt DESC
