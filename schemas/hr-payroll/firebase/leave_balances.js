// leave_balances: current leave balances per employee per policy, denormalized for performance.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LeaveBalanceDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {string} leavePolicyId - FK → leave_policies
 * @property {number} balance - decimal
 * @property {number} accrued - decimal
 * @property {number} used - decimal
 * @property {number} carriedOver - decimal
 * @property {number} year - integer
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LeaveBalanceDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LeaveBalanceDocument, "id">}
 */
export function createLeaveBalance(fields) {
  return {
    employeeId: fields.employeeId,
    leavePolicyId: fields.leavePolicyId,
    balance: fields.balance ?? 0,
    accrued: fields.accrued ?? 0,
    used: fields.used ?? 0,
    carriedOver: fields.carriedOver ?? 0,
    year: fields.year,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const leaveBalanceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      leavePolicyId: data.leavePolicyId,
      balance: data.balance,
      accrued: data.accrued,
      used: data.used,
      carriedOver: data.carriedOver,
      year: data.year,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "leave_balances"
 *   - employeeId ASC, leavePolicyId ASC, year ASC (composite unique)
 *   - leavePolicyId ASC
 */
