// leave_policies: leave type definitions with accrual rules and carryover limits.

import { Timestamp } from "firebase/firestore";

export const LEAVE_TYPE = /** @type {const} */ ({
  VACATION: "vacation",
  SICK: "sick",
  PERSONAL: "personal",
  PARENTAL: "parental",
  BEREAVEMENT: "bereavement",
  JURY_DUTY: "jury_duty",
  UNPAID: "unpaid",
  OTHER: "other",
});

export const ACCRUAL_FREQUENCY = /** @type {const} */ ({
  PER_PAY_PERIOD: "per_pay_period",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  ANNUALLY: "annually",
  NONE: "none",
});

/**
 * @typedef {Object} LeavePolicyDocument
 * @property {string} id
 * @property {string} name
 * @property {typeof LEAVE_TYPE[keyof typeof LEAVE_TYPE]} type
 * @property {number | null} accrualRate
 * @property {typeof ACCRUAL_FREQUENCY[keyof typeof ACCRUAL_FREQUENCY]} accrualFrequency
 * @property {number | null} maxBalance
 * @property {number | null} maxCarryover
 * @property {boolean} isPaid
 * @property {boolean} requiresApproval
 * @property {boolean} isActive
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LeavePolicyDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LeavePolicyDocument, "id">}
 */
export function createLeavePolicy(fields) {
  return {
    name: fields.name,
    type: fields.type,
    accrualRate: fields.accrualRate ?? null,
    accrualFrequency: fields.accrualFrequency ?? ACCRUAL_FREQUENCY.NONE,
    maxBalance: fields.maxBalance ?? null,
    maxCarryover: fields.maxCarryover ?? null,
    isPaid: fields.isPaid ?? true,
    requiresApproval: fields.requiresApproval ?? true,
    isActive: fields.isActive ?? true,
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const leavePolicyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      type: data.type,
      accrualRate: data.accrualRate ?? null,
      accrualFrequency: data.accrualFrequency,
      maxBalance: data.maxBalance ?? null,
      maxCarryover: data.maxCarryover ?? null,
      isPaid: data.isPaid,
      requiresApproval: data.requiresApproval,
      isActive: data.isActive,
      description: data.description ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "leave_policies"
 *   - type ASC
 *   - isActive ASC
 */
