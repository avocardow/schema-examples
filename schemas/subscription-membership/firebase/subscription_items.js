// subscription_items: line items within a subscription linking to specific plan prices.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SubscriptionItemDocument
 * @property {string} id
 * @property {string} subscriptionId - FK → subscriptions
 * @property {string} planPriceId - FK → plan_prices
 * @property {number} quantity
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SubscriptionItemDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SubscriptionItemDocument, "id">}
 */
export function createSubscriptionItem(fields) {
  return {
    subscriptionId: fields.subscriptionId,
    planPriceId: fields.planPriceId,
    quantity: fields.quantity ?? 1,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const subscriptionItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      subscriptionId: data.subscriptionId,
      planPriceId: data.planPriceId,
      quantity: data.quantity,
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
 *   collection: "subscription_items"
 *   - subscriptionId ASC, createdAt DESC
 *   - planPriceId ASC
 *   - providerType ASC, providerId ASC
 */
