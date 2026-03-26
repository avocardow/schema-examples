// venues: Physical, virtual, or hybrid locations where events take place.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENUE_TYPES = /** @type {const} */ ({
  PHYSICAL: "physical",
  VIRTUAL: "virtual",
  HYBRID: "hybrid",
});

/**
 * @typedef {Object} VenueDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {typeof VENUE_TYPES[keyof typeof VENUE_TYPES]} type
 * @property {string | null} addressLine1
 * @property {string | null} addressLine2
 * @property {string | null} city
 * @property {string | null} state
 * @property {string | null} postalCode
 * @property {string | null} country
 * @property {number | null} latitude
 * @property {number | null} longitude
 * @property {string | null} virtualUrl
 * @property {string | null} virtualPlatform
 * @property {number | null} capacity
 * @property {string} timezone
 * @property {string | null} phone
 * @property {string | null} email
 * @property {string | null} websiteUrl
 * @property {boolean} isActive
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<VenueDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<VenueDocument, "id">}
 */
export function createVenue(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    type: fields.type ?? VENUE_TYPES.PHYSICAL,
    addressLine1: fields.addressLine1 ?? null,
    addressLine2: fields.addressLine2 ?? null,
    city: fields.city ?? null,
    state: fields.state ?? null,
    postalCode: fields.postalCode ?? null,
    country: fields.country ?? null,
    latitude: fields.latitude ?? null,
    longitude: fields.longitude ?? null,
    virtualUrl: fields.virtualUrl ?? null,
    virtualPlatform: fields.virtualPlatform ?? null,
    capacity: fields.capacity ?? null,
    timezone: fields.timezone,
    phone: fields.phone ?? null,
    email: fields.email ?? null,
    websiteUrl: fields.websiteUrl ?? null,
    isActive: fields.isActive ?? true,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const venueConverter = {
  /** @param {Omit<VenueDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      type: data.type,
      addressLine1: data.addressLine1 ?? null,
      addressLine2: data.addressLine2 ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      virtualUrl: data.virtualUrl ?? null,
      virtualPlatform: data.virtualPlatform ?? null,
      capacity: data.capacity ?? null,
      timezone: data.timezone,
      phone: data.phone ?? null,
      email: data.email ?? null,
      websiteUrl: data.websiteUrl ?? null,
      isActive: data.isActive,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "venues"
 *   - type (ASC), isActive (ASC)
 *   - city (ASC), isActive (ASC)
 *   - slug (ASC)
 */
