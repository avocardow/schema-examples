// coupon_redemptions: records of when a coupon was applied to a customer or subscription.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CouponRedemptionDocument
 * @property {string} id
 * @property {string} couponId - FK → coupons
 * @property {string} customerId - FK → customers
 * @property {string | null} subscriptionId - FK → subscriptions
 * @property {import("firebase/firestore").Timestamp} redeemedAt
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CouponRedemptionDocument, "id" | "createdAt">} fields
 * @returns {Omit<CouponRedemptionDocument, "id">}
 */
export function createCouponRedemption(fields) {
  return {
    couponId: fields.couponId,
    customerId: fields.customerId,
    subscriptionId: fields.subscriptionId ?? null,
    redeemedAt: fields.redeemedAt ?? Timestamp.now(),
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
  };
}

export const couponRedemptionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      couponId: data.couponId,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId ?? null,
      redeemedAt: data.redeemedAt,
      providerType: data.providerType ?? null,
      providerId: data.providerId ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "coupon_redemptions"
 *   - couponId ASC, redeemedAt DESC
 *   - customerId ASC, redeemedAt DESC
 *   - subscriptionId ASC
 *   - providerType ASC, providerId ASC
 */
