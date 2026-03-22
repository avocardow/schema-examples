// carts: Shopping carts supporting both authenticated users and anonymous sessions.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CartDocument
 * @property {string} id
 * @property {string|null} userId - FK → users
 * @property {string|null} sessionId
 * @property {string} currency
 * @property {string|null} shippingAddressId - FK → addresses
 * @property {string|null} billingAddressId - FK → addresses
 * @property {string|null} discountCode
 * @property {string|null} note
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createCart(fields) {
  return {
    userId: fields.userId ?? null,
    sessionId: fields.sessionId ?? null,
    currency: fields.currency ?? "USD",
    shippingAddressId: fields.shippingAddressId ?? null,
    billingAddressId: fields.billingAddressId ?? null,
    discountCode: fields.discountCode ?? null,
    note: fields.note ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const cartConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId ?? null,
      sessionId: data.sessionId ?? null,
      currency: data.currency,
      shippingAddressId: data.shippingAddressId ?? null,
      billingAddressId: data.billingAddressId ?? null,
      discountCode: data.discountCode ?? null,
      note: data.note ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - carts: userId ASC
  - carts: sessionId ASC
*/
