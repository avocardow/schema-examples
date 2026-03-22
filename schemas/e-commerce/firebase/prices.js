// prices: Currency-specific pricing for product variants with optional date ranges and quantity breaks.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PriceDocument
 * @property {string} id
 * @property {string} variantId - FK → product_variants
 * @property {string} currency
 * @property {number} amount
 * @property {number|null} compareAtAmount
 * @property {number|null} minQuantity
 * @property {Timestamp|null} startsAt
 * @property {Timestamp|null} endsAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createPrice(fields) {
  return {
    variantId: fields.variantId,
    currency: fields.currency,
    amount: fields.amount,
    compareAtAmount: fields.compareAtAmount ?? null,
    minQuantity: fields.minQuantity ?? null,
    startsAt: fields.startsAt ?? null,
    endsAt: fields.endsAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const priceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      variantId: data.variantId,
      currency: data.currency,
      amount: data.amount,
      compareAtAmount: data.compareAtAmount ?? null,
      minQuantity: data.minQuantity ?? null,
      startsAt: data.startsAt ?? null,
      endsAt: data.endsAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - prices: variantId ASC, currency ASC
  - prices: startsAt ASC, endsAt ASC
*/
