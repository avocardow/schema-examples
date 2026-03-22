// fulfillment_items: Links individual order items to a fulfillment with the shipped quantity.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FulfillmentItemDocument
 * @property {string} id
 * @property {string} fulfillmentId - FK → fulfillments
 * @property {string} orderItemId - FK → order_items
 * @property {number} quantity
 * @property {Timestamp} createdAt
 */

export function createFulfillmentItem(fields) {
  return {
    fulfillmentId: fields.fulfillmentId,
    orderItemId: fields.orderItemId,
    quantity: fields.quantity,
    createdAt: Timestamp.now(),
  };
}

export const fulfillmentItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      fulfillmentId: data.fulfillmentId,
      orderItemId: data.orderItemId,
      quantity: data.quantity,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - fulfillment_items: fulfillmentId ASC
  - fulfillment_items: orderItemId ASC
  - fulfillment_items: fulfillmentId ASC, orderItemId ASC (composite unique)
*/
