// coupons: discount codes and promotions applied to subscriptions or invoices.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DISCOUNT_TYPE = /** @type {const} */ ({
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixed_amount",
});

export const COUPON_DURATION = /** @type {const} */ ({
  ONCE: "once",
  REPEATING: "repeating",
  FOREVER: "forever",
});

/**
 * @typedef {Object} CouponDocument
 * @property {string} id
 * @property {string | null} code
 * @property {string} name
 * @property {typeof DISCOUNT_TYPE[keyof typeof DISCOUNT_TYPE]} discountType
 * @property {number} discountValue
 * @property {string | null} currency
 * @property {typeof COUPON_DURATION[keyof typeof COUPON_DURATION]} duration
 * @property {number | null} durationInMonths
 * @property {number | null} maxRedemptions
 * @property {number} timesRedeemed
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp | null} validFrom
 * @property {import("firebase/firestore").Timestamp | null} validUntil
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CouponDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CouponDocument, "id">}
 */
export function createCoupon(fields) {
  return {
    code: fields.code ?? null,
    name: fields.name,
    discountType: fields.discountType,
    discountValue: fields.discountValue,
    currency: fields.currency ?? null,
    duration: fields.duration ?? COUPON_DURATION.ONCE,
    durationInMonths: fields.durationInMonths ?? null,
    maxRedemptions: fields.maxRedemptions ?? null,
    timesRedeemed: fields.timesRedeemed ?? 0,
    isActive: fields.isActive ?? true,
    validFrom: fields.validFrom ?? null,
    validUntil: fields.validUntil ?? null,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const couponConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      code: data.code ?? null,
      name: data.name,
      discountType: data.discountType,
      discountValue: data.discountValue,
      currency: data.currency ?? null,
      duration: data.duration,
      durationInMonths: data.durationInMonths ?? null,
      maxRedemptions: data.maxRedemptions ?? null,
      timesRedeemed: data.timesRedeemed,
      isActive: data.isActive,
      validFrom: data.validFrom ?? null,
      validUntil: data.validUntil ?? null,
      metadata: data.metadata ?? null,
      providerType: data.providerType ?? null,
      providerId: data.providerId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "coupons"
 *   - code ASC (unique where not null)
 *   - isActive ASC, validUntil ASC
 *   - discountType ASC, isActive ASC
 *   - providerType ASC, providerId ASC
 */
