// provider_locations: junction linking providers to locations where they work.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProviderLocationDocument
 * @property {string} id
 * @property {string} providerId - FK → providers
 * @property {string} locationId - FK → locations
 * @property {boolean} isPrimary
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ProviderLocationDocument, "id" | "createdAt">} fields
 */
export function createProviderLocation(fields) {
  return {
    providerId: fields.providerId,
    locationId: fields.locationId,
    isPrimary: fields.isPrimary ?? false,
    createdAt: Timestamp.now(),
  };
}

export const providerLocationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      providerId: data.providerId,
      locationId: data.locationId,
      isPrimary: data.isPrimary,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - providerId (ASC), isPrimary (DESC) — locations for a provider, primary first
 * - locationId (ASC) — providers at a location
 */
