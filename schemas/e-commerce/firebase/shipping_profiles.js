// shipping_profiles: Reusable shipping configuration profiles for product fulfillment strategies.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const SHIPPING_PROFILE_TYPE = /** @type {const} */ ({
  DEFAULT: "default",
  DIGITAL: "digital",
  CUSTOM:  "custom",
});

/**
 * @typedef {Object} ShippingProfileDocument
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string|null} description
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createShippingProfile(fields) {
  return {
    name: fields.name,
    type: fields.type ?? "default",
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const shippingProfileConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      type: data.type,
      description: data.description ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - shipping_profiles: type ASC
*/
