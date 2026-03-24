// provider_services: junction linking providers to the services they offer.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProviderServiceDocument
 * @property {string} id
 * @property {string} providerId - FK → providers
 * @property {string} serviceId - FK → services
 * @property {number | null} customPrice
 * @property {number | null} customDuration
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ProviderServiceDocument, "id" | "createdAt">} fields
 */
export function createProviderService(fields) {
  return {
    providerId: fields.providerId,
    serviceId: fields.serviceId,
    customPrice: fields.customPrice ?? null,
    customDuration: fields.customDuration ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
  };
}

export const providerServiceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      providerId: data.providerId,
      serviceId: data.serviceId,
      customPrice: data.customPrice ?? null,
      customDuration: data.customDuration ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - providerId (ASC), isActive (ASC) — active services for a provider
 * - serviceId (ASC), isActive (ASC) — active providers for a service
 */
