// payment_methods: Stored payment instruments linked to a user for quick checkout.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PAYMENT_METHOD_TYPE = /** @type {const} */ ({
  CARD:       "card",
  BANK_ACCOUNT: "bank_account",
  PAYPAL:     "paypal",
  APPLE_PAY:  "apple_pay",
  GOOGLE_PAY: "google_pay",
});

/**
 * @typedef {Object} PaymentMethodDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} type
 * @property {string} provider
 * @property {string} providerId
 * @property {string|null} label
 * @property {string|null} lastFour
 * @property {string|null} brand
 * @property {number|null} expMonth
 * @property {number|null} expYear
 * @property {boolean} isDefault
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createPaymentMethod(fields) {
  return {
    userId: fields.userId,
    type: fields.type,
    provider: fields.provider,
    providerId: fields.providerId,
    label: fields.label ?? null,
    lastFour: fields.lastFour ?? null,
    brand: fields.brand ?? null,
    expMonth: fields.expMonth ?? null,
    expYear: fields.expYear ?? null,
    isDefault: fields.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const paymentMethodConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      type: data.type,
      provider: data.provider,
      providerId: data.providerId,
      label: data.label ?? null,
      lastFour: data.lastFour ?? null,
      brand: data.brand ?? null,
      expMonth: data.expMonth ?? null,
      expYear: data.expYear ?? null,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - payment_methods: userId ASC
  - payment_methods: provider ASC, providerId ASC (unique)
*/
