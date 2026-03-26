// commission_rules: Configurable commission structures for marketplace revenue sharing.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const COMMISSION_SCOPE = /** @type {const} */ ({
  GLOBAL: "global",
  VENDOR: "vendor",
  CATEGORY: "category",
});

export const COMMISSION_RATE_TYPE = /** @type {const} */ ({
  PERCENTAGE: "percentage",
  FLAT: "flat",
  HYBRID: "hybrid",
});

/**
 * @typedef {Object} CommissionRuleDocument
 * @property {string} id
 * @property {string} name
 * @property {typeof COMMISSION_SCOPE[keyof typeof COMMISSION_SCOPE]} scope
 * @property {string|null} vendorId - FK → vendors
 * @property {string|null} categoryId - FK → categories
 * @property {typeof COMMISSION_RATE_TYPE[keyof typeof COMMISSION_RATE_TYPE]} rateType
 * @property {number|null} percentageRate
 * @property {number|null} flatRate
 * @property {string|null} currency
 * @property {number|null} minCommission
 * @property {number|null} maxCommission
 * @property {boolean} isActive
 * @property {number} priority
 * @property {Timestamp|null} effectiveFrom
 * @property {Timestamp|null} effectiveTo
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<CommissionRuleDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<CommissionRuleDocument, "id">}
 */
export function createCommissionRule(data) {
  return {
    name: data.name,
    scope: data.scope,
    vendorId: data.vendorId ?? null,
    categoryId: data.categoryId ?? null,
    rateType: data.rateType ?? COMMISSION_RATE_TYPE.PERCENTAGE,
    percentageRate: data.percentageRate ?? null,
    flatRate: data.flatRate ?? null,
    currency: data.currency ?? null,
    minCommission: data.minCommission ?? null,
    maxCommission: data.maxCommission ?? null,
    isActive: data.isActive ?? true,
    priority: data.priority ?? 0,
    effectiveFrom: data.effectiveFrom ?? null,
    effectiveTo: data.effectiveTo ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const commissionRuleConverter = {
  toFirestore(rule) {
    const { id, ...data } = rule;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      scope: data.scope,
      vendorId: data.vendorId ?? null,
      categoryId: data.categoryId ?? null,
      rateType: data.rateType,
      percentageRate: data.percentageRate ?? null,
      flatRate: data.flatRate ?? null,
      currency: data.currency ?? null,
      minCommission: data.minCommission ?? null,
      maxCommission: data.maxCommission ?? null,
      isActive: data.isActive,
      priority: data.priority,
      effectiveFrom: data.effectiveFrom ?? null,
      effectiveTo: data.effectiveTo ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - scope ASC, isActive ASC
// - vendorId ASC
// - categoryId ASC
