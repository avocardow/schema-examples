// order_items: Individual line items within an order, capturing product snapshot and pricing at time of purchase.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} OrderItemDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string|null} variantId - FK → product_variants
 * @property {string} productName
 * @property {string} variantTitle
 * @property {string|null} sku
 * @property {string|null} imageUrl
 * @property {number} unitPrice
 * @property {number} quantity
 * @property {number} subtotal
 * @property {number} discountTotal
 * @property {number} taxTotal
 * @property {number} total
 * @property {number} fulfilledQuantity
 * @property {Timestamp} createdAt
 */

export function createOrderItem(fields) {
  return {
    orderId: fields.orderId,
    variantId: fields.variantId ?? null,
    productName: fields.productName,
    variantTitle: fields.variantTitle,
    sku: fields.sku ?? null,
    imageUrl: fields.imageUrl ?? null,
    unitPrice: fields.unitPrice,
    quantity: fields.quantity,
    subtotal: fields.subtotal,
    discountTotal: fields.discountTotal ?? 0,
    taxTotal: fields.taxTotal ?? 0,
    total: fields.total,
    fulfilledQuantity: fields.fulfilledQuantity ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const orderItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      variantId: data.variantId ?? null,
      productName: data.productName,
      variantTitle: data.variantTitle,
      sku: data.sku ?? null,
      imageUrl: data.imageUrl ?? null,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      subtotal: data.subtotal,
      discountTotal: data.discountTotal,
      taxTotal: data.taxTotal,
      total: data.total,
      fulfilledQuantity: data.fulfilledQuantity,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - order_items: orderId ASC
  - order_items: variantId ASC
*/
