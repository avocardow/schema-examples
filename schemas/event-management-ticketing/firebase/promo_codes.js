// promo_codes: Discount codes applicable to event ticket purchases.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DISCOUNT_TYPES = /** @type {const} */ ({
  PERCENTAGE: "percentage",
  FIXED: "fixed",
});

/**
 * @typedef {Object} PromoCodeDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string} code
 * @property {typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES]} discountType
 * @property {number} discountValue - Integer amount in smallest currency unit (cents) when type is fixed; percentage (0–100) when type is percentage
 * @property {string | null} currency
 * @property {number | null} maxUses
 * @property {number} timesUsed
 * @property {number} maxUsesPerOrder
 * @property {import("firebase/firestore").Timestamp | null} validFrom
 * @property {import("firebase/firestore").Timestamp | null} validUntil
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PromoCodeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PromoCodeDocument, "id">}
 */
export function createPromoCode(fields) {
  return {
    eventId: fields.eventId,
    code: fields.code,
    discountType: fields.discountType,
    discountValue: fields.discountValue,
    currency: fields.currency ?? null,
    maxUses: fields.maxUses ?? null,
    timesUsed: fields.timesUsed ?? 0,
    maxUsesPerOrder: fields.maxUsesPerOrder ?? 1,
    validFrom: fields.validFrom ?? null,
    validUntil: fields.validUntil ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const promoCodeConverter = {
  /** @param {Omit<PromoCodeDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      code: data.code,
      discountType: data.discountType,
      discountValue: data.discountValue,
      currency: data.currency ?? null,
      maxUses: data.maxUses ?? null,
      timesUsed: data.timesUsed,
      maxUsesPerOrder: data.maxUsesPerOrder,
      validFrom: data.validFrom ?? null,
      validUntil: data.validUntil ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "promo_codes"
 *   - eventId (ASC), code (ASC)
 *   - eventId (ASC), isActive (ASC)
 *   - code (ASC)
 */
