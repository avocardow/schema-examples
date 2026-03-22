// shipping_methods: Delivery options per shipping zone with pricing, weight limits, and estimated delivery windows.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ShippingMethodDocument
 * @property {string} id
 * @property {string} zoneId - FK → shipping_zones
 * @property {string|null} profileId - FK → shipping_profiles
 * @property {string} name
 * @property {string|null} description
 * @property {number} price
 * @property {string} currency
 * @property {number|null} minDeliveryDays
 * @property {number|null} maxDeliveryDays
 * @property {number|null} minOrderAmount
 * @property {number|null} maxWeightGrams
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createShippingMethod(fields) {
  return {
    zoneId: fields.zoneId,
    profileId: fields.profileId ?? null,
    name: fields.name,
    description: fields.description ?? null,
    price: fields.price,
    currency: fields.currency,
    minDeliveryDays: fields.minDeliveryDays ?? null,
    maxDeliveryDays: fields.maxDeliveryDays ?? null,
    minOrderAmount: fields.minOrderAmount ?? null,
    maxWeightGrams: fields.maxWeightGrams ?? null,
    isActive: fields.isActive ?? true,
    sortOrder: fields.sortOrder ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const shippingMethodConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      zoneId: data.zoneId,
      profileId: data.profileId ?? null,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      currency: data.currency,
      minDeliveryDays: data.minDeliveryDays ?? null,
      maxDeliveryDays: data.maxDeliveryDays ?? null,
      minOrderAmount: data.minOrderAmount ?? null,
      maxWeightGrams: data.maxWeightGrams ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - shipping_methods: zoneId ASC, isActive ASC, sortOrder ASC
  - shipping_methods: profileId ASC
*/
