// pay_stubs: individual employee pay statements per payroll run.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PayStubDocument
 * @property {string} id
 * @property {string} payrollRunId - FK → payroll_runs
 * @property {string} employeeId - FK → employees
 * @property {number} grossPay
 * @property {number} totalDeductions
 * @property {number} netPay
 * @property {string} currency
 * @property {string} payDate - Calendar date "YYYY-MM-DD"
 * @property {string} periodStart - Calendar date "YYYY-MM-DD"
 * @property {string} periodEnd - Calendar date "YYYY-MM-DD"
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PayStubDocument, "id" | "createdAt">} fields
 * @returns {Omit<PayStubDocument, "id">}
 */
export function createPayStub(fields) {
  return {
    payrollRunId: fields.payrollRunId,
    employeeId: fields.employeeId,
    grossPay: fields.grossPay ?? 0,
    totalDeductions: fields.totalDeductions ?? 0,
    netPay: fields.netPay ?? 0,
    currency: fields.currency ?? "USD",
    payDate: fields.payDate,
    periodStart: fields.periodStart,
    periodEnd: fields.periodEnd,
    createdAt: Timestamp.now(),
  };
}

export const payStubConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      payrollRunId: data.payrollRunId,
      employeeId: data.employeeId,
      grossPay: data.grossPay,
      totalDeductions: data.totalDeductions,
      netPay: data.netPay,
      currency: data.currency,
      payDate: data.payDate,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pay_stubs"
 *   - payrollRunId ASC, employeeId ASC (composite unique)
 *   - employeeId ASC, payDate DESC
 *   - payDate ASC
 */
