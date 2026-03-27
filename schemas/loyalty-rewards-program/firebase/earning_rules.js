// earning_rules: Rules defining how members earn points (event type, amount, conditions).
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const EARNING_TYPE = /** @type {const} */ ({
  FIXED: "fixed",
  PER_CURRENCY: "per_currency",
  MULTIPLIER: "multiplier",
});

/**
 * @typedef {Object} EarningRuleDocument
 * @property {string} id
 * @property {string} programId - FK → loyalty_programs
 * @property {string} name
 * @property {string|null} description
 * @property {string} eventType
 * @property {typeof EARNING_TYPE[keyof typeof EARNING_TYPE]} earningType
 * @property {number|null} pointsAmount
 * @property {number|null} multiplier
 * @property {number|null} minPurchaseAmount
 * @property {number|null} maxPointsPerEvent
 * @property {Object|null} conditions
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<EarningRuleDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<EarningRuleDocument, "id">}
 */
export function createEarningRule(data) {
  return {
    programId: data.programId,
    name: data.name,
    description: data.description ?? null,
    eventType: data.eventType,
    earningType: data.earningType ?? EARNING_TYPE.FIXED,
    pointsAmount: data.pointsAmount ?? null,
    multiplier: data.multiplier ?? null,
    minPurchaseAmount: data.minPurchaseAmount ?? null,
    maxPointsPerEvent: data.maxPointsPerEvent ?? null,
    conditions: data.conditions ?? null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const earningRuleConverter = {
  toFirestore(rule) {
    const { id, ...data } = rule;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      programId: data.programId,
      name: data.name,
      description: data.description ?? null,
      eventType: data.eventType,
      earningType: data.earningType,
      pointsAmount: data.pointsAmount ?? null,
      multiplier: data.multiplier ?? null,
      minPurchaseAmount: data.minPurchaseAmount ?? null,
      maxPointsPerEvent: data.maxPointsPerEvent ?? null,
      conditions: data.conditions ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - earning_rules: programId ASC, isActive ASC
// - earning_rules: eventType ASC
