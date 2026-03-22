// return_items: Individual line items within a return authorization, tracking quantity and condition of returned products.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const RETURN_ITEM_CONDITION = /** @type {const} */ ({
  UNOPENED:  "unopened",
  LIKE_NEW:  "like_new",
  USED:      "used",
  DAMAGED:   "damaged",
  DEFECTIVE: "defective",
});

/**
 * @typedef {Object} ReturnItemDocument
 * @property {string} id
 * @property {string} returnAuthorizationId - FK → return_authorizations
 * @property {string} orderItemId - FK → order_items
 * @property {number} quantity
 * @property {string|null} reason
 * @property {string|null} condition
 * @property {number} receivedQuantity
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createReturnItem(fields) {
  return {
    returnAuthorizationId: fields.returnAuthorizationId,
    orderItemId: fields.orderItemId,
    quantity: fields.quantity,
    reason: fields.reason ?? null,
    condition: fields.condition ?? null,
    receivedQuantity: fields.receivedQuantity ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const returnItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      returnAuthorizationId: data.returnAuthorizationId,
      orderItemId: data.orderItemId,
      quantity: data.quantity,
      reason: data.reason ?? null,
      condition: data.condition ?? null,
      receivedQuantity: data.receivedQuantity,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - return_items: returnAuthorizationId ASC
  - return_items: orderItemId ASC
  - return_items: returnAuthorizationId ASC, orderItemId ASC (unique)
*/
