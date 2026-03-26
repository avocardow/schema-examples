// payroll_runs: batch payroll processing runs for a pay schedule and period.

import { Timestamp } from "firebase/firestore";

export const PAYROLL_RUN_STATUS = /** @type {const} */ ({
  DRAFT:      "draft",
  PROCESSING: "processing",
  COMPLETED:  "completed",
  FAILED:     "failed",
  VOIDED:     "voided",
});

/**
 * @typedef {Object} PayrollRunDocument
 * @property {string} id
 * @property {string} payScheduleId - FK → pay_schedules
 * @property {string} periodStart - Calendar date "YYYY-MM-DD"
 * @property {string} periodEnd - Calendar date "YYYY-MM-DD"
 * @property {string} payDate - Calendar date "YYYY-MM-DD"
 * @property {typeof PAYROLL_RUN_STATUS[keyof typeof PAYROLL_RUN_STATUS]} status
 * @property {number} totalGross
 * @property {number} totalDeductions
 * @property {number} totalNet
 * @property {number} employeeCount
 * @property {string} currency
 * @property {import("firebase/firestore").Timestamp | null} processedAt
 * @property {string|null} processedBy - FK → users
 * @property {string|null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PayrollRunDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PayrollRunDocument, "id">}
 */
export function createPayrollRun(fields) {
  return {
    payScheduleId:   fields.payScheduleId,
    periodStart:     fields.periodStart,
    periodEnd:       fields.periodEnd,
    payDate:         fields.payDate,
    status:          fields.status          ?? PAYROLL_RUN_STATUS.DRAFT,
    totalGross:      fields.totalGross      ?? 0,
    totalDeductions: fields.totalDeductions ?? 0,
    totalNet:        fields.totalNet        ?? 0,
    employeeCount:   fields.employeeCount   ?? 0,
    currency:        fields.currency        ?? "USD",
    processedAt:     fields.processedAt     ?? null,
    processedBy:     fields.processedBy     ?? null,
    notes:           fields.notes           ?? null,
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  };
}

export const payrollRunConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      payScheduleId:   data.payScheduleId,
      periodStart:     data.periodStart,
      periodEnd:       data.periodEnd,
      payDate:         data.payDate,
      status:          data.status,
      totalGross:      data.totalGross,
      totalDeductions: data.totalDeductions,
      totalNet:        data.totalNet,
      employeeCount:   data.employeeCount,
      currency:        data.currency,
      processedAt:     data.processedAt     ?? null,  // Timestamp | null
      processedBy:     data.processedBy     ?? null,
      notes:           data.notes           ?? null,
      createdAt:       data.createdAt,
      updatedAt:       data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "payroll_runs"
 *   - payScheduleId ASC, payDate DESC
 *   - status ASC
 *   - payDate ASC
 */
