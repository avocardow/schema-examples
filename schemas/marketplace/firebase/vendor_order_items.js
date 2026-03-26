// vendor_order_items: Line items within vendor-specific order splits.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} VendorOrderItemDocument
 * @property {string} id
 * @property {string} vendorOrderId - FK → vendor_orders
 * @property {string} orderItemId - FK → order_items
 * @property {string|null} listingVariantId - FK → listing_variants
 * @property {string} productName
 * @property {string} variantTitle
 * @property {string|null} sku
 * @property {number} unitPrice
 * @property {number} quantity
 * @property {number} subtotal
 * @property {number} commissionAmount
 * @property {number} vendorEarning
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<VendorOrderItemDocument, "id" | "createdAt">} data
 * @returns {Omit<VendorOrderItemDocument, "id">}
 */
export function createVendorOrderItem(data) {
  return {
    vendorOrderId: data.vendorOrderId,
    orderItemId: data.orderItemId,
    listingVariantId: data.listingVariantId ?? null,
    productName: data.productName,
    variantTitle: data.variantTitle,
    sku: data.sku ?? null,
    unitPrice: data.unitPrice,
    quantity: data.quantity,
    subtotal: data.subtotal,
    commissionAmount: data.commissionAmount ?? 0,
    vendorEarning: data.vendorEarning ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const vendorOrderItemConverter = {
  toFirestore(item) {
    const { id, ...data } = item;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorOrderId: data.vendorOrderId,
      orderItemId: data.orderItemId,
      listingVariantId: data.listingVariantId ?? null,
      productName: data.productName,
      variantTitle: data.variantTitle,
      sku: data.sku ?? null,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      subtotal: data.subtotal,
      commissionAmount: data.commissionAmount,
      vendorEarning: data.vendorEarning,
      createdAt: data.createdAt,
    };
  },
};

// Suggested indexes:
// - vendorOrderId ASC
// - orderItemId ASC
