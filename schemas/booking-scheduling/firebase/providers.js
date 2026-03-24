// providers: individuals who deliver bookable services to customers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProviderDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} displayName
 * @property {string | null} bio
 * @property {string | null} avatarUrl
 * @property {string} timezone
 * @property {string | null} phone
 * @property {string | null} email
 * @property {boolean} isActive
 * @property {boolean} isAccepting
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ProviderDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createProvider(fields) {
  return {
    userId: fields.userId,
    displayName: fields.displayName,
    bio: fields.bio ?? null,
    avatarUrl: fields.avatarUrl ?? null,
    timezone: fields.timezone,
    phone: fields.phone ?? null,
    email: fields.email ?? null,
    isActive: fields.isActive ?? true,
    isAccepting: fields.isAccepting ?? true,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const providerConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
      timezone: data.timezone,
      phone: data.phone ?? null,
      email: data.email ?? null,
      isActive: data.isActive,
      isAccepting: data.isAccepting,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - userId (ASC) — unique user lookup
 * - isActive (ASC), isAccepting (ASC), position (ASC) — active accepting providers
 */
