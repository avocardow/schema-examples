// tax_rates: Tax rate definitions by country and region with compound and priority support.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TaxRateDocument
 * @property {string} id
 * @property {string} name
 * @property {string} country
 * @property {string|null} region
 * @property {number} rate
 * @property {string|null} category
 * @property {boolean} isCompound
 * @property {boolean} isActive
 * @property {number} priority
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createTaxRate(fields) {
  return {
    name: fields.name,
    country: fields.country,
    region: fields.region ?? null,
    rate: fields.rate,
    category: fields.category ?? null,
    isCompound: fields.isCompound ?? false,
    isActive: fields.isActive ?? true,
    priority: fields.priority ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const taxRateConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      country: data.country,
      region: data.region ?? null,
      rate: data.rate,
      category: data.category ?? null,
      isCompound: data.isCompound,
      isActive: data.isActive,
      priority: data.priority,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - tax_rates: country ASC, region ASC
  - tax_rates: category ASC
  - tax_rates: isActive ASC
*/
