// order_items: Individual line items within a ticket order.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} OrderItemDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string | null} ticketTypeId - FK → ticket_types
 * @property {string} ticketTypeName
 * @property {number} unitPrice - Integer price in smallest currency unit (cents)
 * @property {number} quantity
 * @property {number} subtotal - Integer amount in smallest currency unit (cents)
 * @property {string} currency
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<OrderItemDocument, "id" | "createdAt">} fields
 * @returns {Omit<OrderItemDocument, "id">}
 */
export function createOrderItem(fields) {
  return {
    orderId: fields.orderId,
    ticketTypeId: fields.ticketTypeId ?? null,
    ticketTypeName: fields.ticketTypeName,
    unitPrice: fields.unitPrice,
    quantity: fields.quantity,
    subtotal: fields.subtotal,
    currency: fields.currency,
    createdAt: Timestamp.now(),
  };
}

export const orderItemConverter = {
  /** @param {Omit<OrderItemDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      ticketTypeId: data.ticketTypeId ?? null,
      ticketTypeName: data.ticketTypeName,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      subtotal: data.subtotal,
      currency: data.currency,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "order_items"
 *   - orderId (ASC)
 *   - ticketTypeId (ASC)
 */
