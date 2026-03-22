// fulfillment_providers: External and internal providers responsible for shipping and delivery fulfillment.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const FULFILLMENT_PROVIDER_TYPE = /** @type {const} */ ({
  MANUAL:              "manual",
  FLAT_RATE:           "flat_rate",
  CARRIER_CALCULATED:  "carrier_calculated",
  THIRD_PARTY:         "third_party",
});

/**
 * @typedef {Object} FulfillmentProviderDocument
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} type
 * @property {Object|null} config
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createFulfillmentProvider(fields) {
  return {
    name: fields.name,
    code: fields.code,
    type: fields.type,
    config: fields.config ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const fulfillmentProviderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      code: data.code,
      type: data.type,
      config: data.config ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - fulfillment_providers: isActive ASC
  - fulfillment_providers: code ASC (unique)
*/
