// discount_usages: Tracks each time a discount is applied to an order, enforcing per-order uniqueness.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} DiscountUsageDocument
 * @property {string} id
 * @property {string} discountId - FK → discounts
 * @property {string} orderId - FK → orders
 * @property {string|null} userId - FK → users
 * @property {Timestamp} createdAt
 */

export function createDiscountUsage(fields) {
  return {
    discountId: fields.discountId,
    orderId: fields.orderId,
    userId: fields.userId ?? null,
    createdAt: Timestamp.now(),
  };
}

export const discountUsageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      discountId: data.discountId,
      orderId: data.orderId,
      userId: data.userId ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - discount_usages: discountId ASC, userId ASC
  - discount_usages: discountId ASC, orderId ASC (composite unique)
*/
