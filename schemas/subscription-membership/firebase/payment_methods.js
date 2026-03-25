// payment_methods: stored payment instruments linked to a customer for recurring billing.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PAYMENT_METHOD_TYPE = /** @type {const} */ ({
  CARD: "card",
  BANK_ACCOUNT: "bank_account",
  PAYPAL: "paypal",
  SEPA_DEBIT: "sepa_debit",
  IDEAL: "ideal",
  OTHER: "other",
});

/**
 * @typedef {Object} PaymentMethodDocument
 * @property {string} id
 * @property {string} customerId - FK → customers
 * @property {typeof PAYMENT_METHOD_TYPE[keyof typeof PAYMENT_METHOD_TYPE]} type
 * @property {string | null} cardBrand
 * @property {string | null} cardLast4
 * @property {number | null} cardExpMonth
 * @property {number | null} cardExpYear
 * @property {boolean} isDefault
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PaymentMethodDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PaymentMethodDocument, "id">}
 */
export function createPaymentMethod(fields) {
  return {
    customerId: fields.customerId,
    type: fields.type,
    cardBrand: fields.cardBrand ?? null,
    cardLast4: fields.cardLast4 ?? null,
    cardExpMonth: fields.cardExpMonth ?? null,
    cardExpYear: fields.cardExpYear ?? null,
    isDefault: fields.isDefault ?? false,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
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
      customerId: data.customerId,
      type: data.type,
      cardBrand: data.cardBrand ?? null,
      cardLast4: data.cardLast4 ?? null,
      cardExpMonth: data.cardExpMonth ?? null,
      cardExpYear: data.cardExpYear ?? null,
      isDefault: data.isDefault,
      providerType: data.providerType ?? null,
      providerId: data.providerId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "payment_methods"
 *   - customerId ASC, isDefault DESC
 *   - customerId ASC, createdAt DESC
 *   - providerType ASC, providerId ASC
 */
