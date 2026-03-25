// plans: subscription plan definitions that group one or more pricing tiers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PlanDocument
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PlanDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PlanDocument, "id">}
 */
export function createPlan(fields) {
  return {
    name: fields.name,
    description: fields.description ?? null,
    isActive: fields.isActive ?? true,
    sortOrder: fields.sortOrder ?? 0,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const planConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
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
 *   collection: "plans"
 *   - isActive ASC, sortOrder ASC
 *   - providerType ASC, providerId ASC
 */
