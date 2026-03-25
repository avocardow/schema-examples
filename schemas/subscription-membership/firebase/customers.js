// customers: subscriber or organization accounts that own subscriptions and billing details.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CustomerDocument
 * @property {string} id
 * @property {string | null} userId - FK → users
 * @property {string | null} organizationId - FK → organizations
 * @property {string} name
 * @property {string} email
 * @property {string | null} currency
 * @property {string | null} taxId
 * @property {Object | null} metadata
 * @property {string | null} providerType
 * @property {string | null} providerId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CustomerDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CustomerDocument, "id">}
 */
export function createCustomer(fields) {
  return {
    userId: fields.userId ?? null,
    organizationId: fields.organizationId ?? null,
    name: fields.name,
    email: fields.email,
    currency: fields.currency ?? null,
    taxId: fields.taxId ?? null,
    metadata: fields.metadata ?? null,
    providerType: fields.providerType ?? null,
    providerId: fields.providerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const customerConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId ?? null,
      organizationId: data.organizationId ?? null,
      name: data.name,
      email: data.email,
      currency: data.currency ?? null,
      taxId: data.taxId ?? null,
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
 *   collection: "customers"
 *   - userId ASC, createdAt DESC
 *   - organizationId ASC, createdAt DESC
 *   - providerType ASC, providerId ASC
 */
