// plan_prices: individual pricing tiers attached to a plan with billing interval and amount.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PRICE_TYPE = /** @type {const} */ ({
  RECURRING: "recurring",
  ONE_TIME: "one_time",
  USAGE_BASED: "usage_based",
});

export const PRICE_INTERVAL = /** @type {const} */ ({
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
});

/**
 * @typedef {Object} PlanPriceDocument
 * @property {string} id
 * @property {string} planId - FK → plans
 * @property {string | null} nickname
 * @property {typeof PRICE_TYPE[keyof typeof PRICE_TYPE]} type
 * @property {number} amount
 * @property {string} currency
 * @property {typeof PRICE_INTERVAL[keyof typeof PRICE_INTERVAL] | null} interval
 * @property {number} intervalCount
 * @property {number | null} trialPeriodDays
 * @property {boolean} isActive
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PlanPriceDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PlanPriceDocument, "id">}
 */
export function createPlanPrice(fields) {
  return {
    planId: fields.planId,
    nickname: fields.nickname ?? null,
    type: fields.type ?? PRICE_TYPE.RECURRING,
    amount: fields.amount,
    currency: fields.currency,
    interval: fields.interval ?? null,
    intervalCount: fields.intervalCount ?? 1,
    trialPeriodDays: fields.trialPeriodDays ?? null,
    isActive: fields.isActive ?? true,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const planPriceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      planId: data.planId,
      nickname: data.nickname ?? null,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      interval: data.interval ?? null,
      intervalCount: data.intervalCount,
      trialPeriodDays: data.trialPeriodDays ?? null,
      isActive: data.isActive,
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
 *   collection: "plan_prices"
 *   - planId ASC, isActive ASC
 *   - planId ASC, type ASC
 *   - providerType ASC, providerId ASC
 */
