// services: bookable services with duration, pricing, and capacity settings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ServiceDocument
 * @property {string} id
 * @property {string | null} categoryId - FK → service_categories
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {number} duration
 * @property {number} bufferBefore
 * @property {number} bufferAfter
 * @property {number | null} price
 * @property {string | null} currency
 * @property {number} maxAttendees
 * @property {number} minAttendees
 * @property {number} minNotice
 * @property {number} maxAdvance
 * @property {number | null} slotInterval
 * @property {boolean} isActive
 * @property {boolean} isPrivate
 * @property {string | null} color
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ServiceDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createService(fields) {
  return {
    categoryId: fields.categoryId ?? null,
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    duration: fields.duration,
    bufferBefore: fields.bufferBefore ?? 0,
    bufferAfter: fields.bufferAfter ?? 0,
    price: fields.price ?? null,
    currency: fields.currency ?? null,
    maxAttendees: fields.maxAttendees ?? 1,
    minAttendees: fields.minAttendees ?? 1,
    minNotice: fields.minNotice ?? 0,
    maxAdvance: fields.maxAdvance ?? 43200,
    slotInterval: fields.slotInterval ?? null,
    isActive: fields.isActive ?? true,
    isPrivate: fields.isPrivate ?? false,
    color: fields.color ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const serviceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      categoryId: data.categoryId ?? null,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      duration: data.duration,
      bufferBefore: data.bufferBefore,
      bufferAfter: data.bufferAfter,
      price: data.price ?? null,
      currency: data.currency ?? null,
      maxAttendees: data.maxAttendees,
      minAttendees: data.minAttendees,
      minNotice: data.minNotice,
      maxAdvance: data.maxAdvance,
      slotInterval: data.slotInterval ?? null,
      isActive: data.isActive,
      isPrivate: data.isPrivate,
      color: data.color ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - slug (ASC) — unique slug lookups
 * - categoryId (ASC), isActive (ASC) — services by category
 * - isActive (ASC), isPrivate (ASC) — public active services
 * - createdBy (ASC), createdAt (DESC) — services by creator
 */
