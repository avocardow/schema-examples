// locations: physical or virtual venues where services are provided.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const LOCATION_TYPES = /** @type {const} */ ({
  PHYSICAL: "physical",
  VIRTUAL: "virtual",
});

/**
 * @typedef {Object} LocationDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {typeof LOCATION_TYPES[keyof typeof LOCATION_TYPES]} type
 * @property {string | null} description
 * @property {string | null} addressLine1
 * @property {string | null} addressLine2
 * @property {string | null} city
 * @property {string | null} state
 * @property {string | null} postalCode
 * @property {string | null} country
 * @property {string | null} virtualUrl
 * @property {string} timezone
 * @property {string | null} phone
 * @property {string | null} email
 * @property {boolean} isActive
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LocationDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createLocation(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    type: fields.type ?? LOCATION_TYPES.PHYSICAL,
    description: fields.description ?? null,
    addressLine1: fields.addressLine1 ?? null,
    addressLine2: fields.addressLine2 ?? null,
    city: fields.city ?? null,
    state: fields.state ?? null,
    postalCode: fields.postalCode ?? null,
    country: fields.country ?? null,
    virtualUrl: fields.virtualUrl ?? null,
    timezone: fields.timezone,
    phone: fields.phone ?? null,
    email: fields.email ?? null,
    isActive: fields.isActive ?? true,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const locationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      type: data.type,
      description: data.description ?? null,
      addressLine1: data.addressLine1 ?? null,
      addressLine2: data.addressLine2 ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? null,
      virtualUrl: data.virtualUrl ?? null,
      timezone: data.timezone,
      phone: data.phone ?? null,
      email: data.email ?? null,
      isActive: data.isActive,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - slug (ASC) — unique slug lookups
 * - type (ASC), isActive (ASC) — locations by type
 * - isActive (ASC), position (ASC) — active locations in order
 */
