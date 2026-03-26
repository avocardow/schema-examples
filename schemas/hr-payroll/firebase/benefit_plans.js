// benefit_plans: benefit plan definitions with contribution details.

import { Timestamp } from "firebase/firestore";

export const BENEFIT_PLAN_TYPE = /** @type {const} */ ({
  HEALTH: "health",
  DENTAL: "dental",
  VISION: "vision",
  RETIREMENT_401K: "retirement_401k",
  LIFE_INSURANCE: "life_insurance",
  DISABILITY: "disability",
  HSA: "hsa",
  FSA: "fsa",
  OTHER: "other",
});

/**
 * @typedef {Object} BenefitPlanDocument
 * @property {string} id
 * @property {string} name
 * @property {typeof BENEFIT_PLAN_TYPE[keyof typeof BENEFIT_PLAN_TYPE]} type
 * @property {string | null} description
 * @property {number | null} employerContribution
 * @property {number | null} employeeContribution
 * @property {string} currency
 * @property {boolean} isActive
 * @property {string | null} planYearStart
 * @property {string | null} planYearEnd
 * @property {Object | null} metadata
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * Contributions are integers (cents). planYearStart/planYearEnd are calendar date strings (e.g. "2025-01-01").
 *
 * @param {Omit<BenefitPlanDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<BenefitPlanDocument, "id">}
 */
export function createBenefitPlan(fields) {
  return {
    name: fields.name,
    type: fields.type,
    description: fields.description ?? null,
    employerContribution: fields.employerContribution ?? null,
    employeeContribution: fields.employeeContribution ?? null,
    currency: fields.currency ?? "USD",
    isActive: fields.isActive ?? true,
    planYearStart: fields.planYearStart ?? null,
    planYearEnd: fields.planYearEnd ?? null,
    metadata: fields.metadata ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const benefitPlanConverter = {
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
      employerContribution: data.employerContribution ?? null,
      employeeContribution: data.employeeContribution ?? null,
      currency: data.currency,
      isActive: data.isActive,
      planYearStart: data.planYearStart ?? null,
      planYearEnd: data.planYearEnd ?? null,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "benefit_plans"
 *   - type ASC
 *   - isActive ASC
 */
