// service_addons: optional extras that can be added to a service booking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ServiceAddonDocument
 * @property {string} id
 * @property {string} serviceId - FK → services
 * @property {string} name
 * @property {string | null} description
 * @property {number} duration
 * @property {number} price
 * @property {string | null} currency
 * @property {number} position
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ServiceAddonDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createServiceAddon(fields) {
  return {
    serviceId: fields.serviceId,
    name: fields.name,
    description: fields.description ?? null,
    duration: fields.duration ?? 0,
    price: fields.price ?? 0,
    currency: fields.currency ?? null,
    position: fields.position ?? 0,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const serviceAddonConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      serviceId: data.serviceId,
      name: data.name,
      description: data.description ?? null,
      duration: data.duration,
      price: data.price,
      currency: data.currency ?? null,
      position: data.position,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - serviceId (ASC), position (ASC) — addons for a service in order
 * - serviceId (ASC), isActive (ASC) — active addons for a service
 */
