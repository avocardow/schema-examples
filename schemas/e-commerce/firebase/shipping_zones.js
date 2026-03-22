// shipping_zones: Geographic shipping zones grouping countries for delivery rule assignment.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ShippingZoneDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string[]} countries
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createShippingZone(fields) {
  return {
    name: fields.name,
    description: fields.description ?? null,
    countries: fields.countries,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const shippingZoneConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description ?? null,
      countries: data.countries,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - shipping_zones: isActive ASC
*/
