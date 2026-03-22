// discounts: Discount codes and rules with usage tracking and date-bound activation.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const DISCOUNT_TYPE = /** @type {const} */ ({
  PERCENTAGE:    "percentage",
  FIXED_AMOUNT:  "fixed_amount",
  FREE_SHIPPING: "free_shipping",
});

/**
 * @typedef {Object} DiscountDocument
 * @property {string} id
 * @property {string|null} code
 * @property {string} type
 * @property {number} value
 * @property {string|null} currency
 * @property {Object|null} conditions
 * @property {number|null} usageLimit
 * @property {number} usageCount
 * @property {number|null} perCustomerLimit
 * @property {Timestamp|null} startsAt
 * @property {Timestamp|null} endsAt
 * @property {boolean} isActive
 * @property {string} createdBy - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createDiscount(fields) {
  return {
    code: fields.code ?? null,
    type: fields.type,
    value: fields.value,
    currency: fields.currency ?? null,
    conditions: fields.conditions ?? null,
    usageLimit: fields.usageLimit ?? null,
    usageCount: fields.usageCount ?? 0,
    perCustomerLimit: fields.perCustomerLimit ?? null,
    startsAt: fields.startsAt ?? null,
    endsAt: fields.endsAt ?? null,
    isActive: fields.isActive ?? true,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const discountConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      code: data.code ?? null,
      type: data.type,
      value: data.value,
      currency: data.currency ?? null,
      conditions: data.conditions ?? null,
      usageLimit: data.usageLimit ?? null,
      usageCount: data.usageCount,
      perCustomerLimit: data.perCustomerLimit ?? null,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
      isActive: data.isActive,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - discounts: code ASC (unique)
  - discounts: type ASC
  - discounts: isActive ASC, startsAt ASC, endsAt ASC
*/
