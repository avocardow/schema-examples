// subscriptions: active or historical subscription records linking customers to plans.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const SUBSCRIPTION_STATUS = /** @type {const} */ ({
  TRIALING: "trialing",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  PAUSED: "paused",
  CANCELED: "canceled",
  EXPIRED: "expired",
  INCOMPLETE: "incomplete",
});

/**
 * @typedef {Object} SubscriptionDocument
 * @property {string} id
 * @property {string} customerId - FK → customers
 * @property {typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS]} status
 * @property {import("firebase/firestore").Timestamp | null} currentPeriodStart
 * @property {import("firebase/firestore").Timestamp | null} currentPeriodEnd
 * @property {import("firebase/firestore").Timestamp | null} trialStart
 * @property {import("firebase/firestore").Timestamp | null} trialEnd
 * @property {import("firebase/firestore").Timestamp | null} canceledAt
 * @property {import("firebase/firestore").Timestamp | null} endedAt
 * @property {boolean} cancelAtPeriodEnd
 * @property {import("firebase/firestore").Timestamp | null} pausedAt
 * @property {import("firebase/firestore").Timestamp | null} resumesAt
 * @property {import("firebase/firestore").Timestamp | null} billingCycleAnchor
 * @property {string | null} couponId - FK → coupons
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SubscriptionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SubscriptionDocument, "id">}
 */
export function createSubscription(fields) {
  return {
    customerId: fields.customerId,
    status: fields.status ?? SUBSCRIPTION_STATUS.INCOMPLETE,
    currentPeriodStart: fields.currentPeriodStart ?? null,
    currentPeriodEnd: fields.currentPeriodEnd ?? null,
    trialStart: fields.trialStart ?? null,
    trialEnd: fields.trialEnd ?? null,
    canceledAt: fields.canceledAt ?? null,
    endedAt: fields.endedAt ?? null,
    cancelAtPeriodEnd: fields.cancelAtPeriodEnd ?? false,
    pausedAt: fields.pausedAt ?? null,
    resumesAt: fields.resumesAt ?? null,
    billingCycleAnchor: fields.billingCycleAnchor ?? null,
    couponId: fields.couponId ?? null,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const subscriptionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customerId: data.customerId,
      status: data.status,
      currentPeriodStart: data.currentPeriodStart ?? null,
      currentPeriodEnd: data.currentPeriodEnd ?? null,
      trialStart: data.trialStart ?? null,
      trialEnd: data.trialEnd ?? null,
      canceledAt: data.canceledAt ?? null,
      endedAt: data.endedAt ?? null,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      pausedAt: data.pausedAt ?? null,
      resumesAt: data.resumesAt ?? null,
      billingCycleAnchor: data.billingCycleAnchor ?? null,
      couponId: data.couponId ?? null,
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
 *   collection: "subscriptions"
 *   - customerId ASC, status ASC
 *   - customerId ASC, createdAt DESC
 *   - status ASC, currentPeriodEnd ASC
 *   - providerType ASC, providerId ASC
 */
