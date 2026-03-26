// compensation: employee compensation records with pay rate, frequency, and effective dates.

import { Timestamp } from "firebase/firestore";

export const PAY_TYPE = /** @type {const} */ ({
  SALARY: "salary",
  HOURLY: "hourly",
});

export const PAY_FREQUENCY = /** @type {const} */ ({
  WEEKLY: "weekly",
  BIWEEKLY: "biweekly",
  SEMIMONTHLY: "semimonthly",
  MONTHLY: "monthly",
  ANNUALLY: "annually",
});

/**
 * @typedef {Object} CompensationDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {typeof PAY_TYPE[keyof typeof PAY_TYPE]} payType
 * @property {number} amount - Integer amount in cents
 * @property {string} currency
 * @property {typeof PAY_FREQUENCY[keyof typeof PAY_FREQUENCY]} payFrequency
 * @property {string} effectiveDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} endDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} reason
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CompensationDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CompensationDocument, "id">}
 */
export function createCompensation(fields) {
  return {
    employeeId: fields.employeeId,
    payType: fields.payType,
    amount: fields.amount,
    currency: fields.currency ?? "USD",
    payFrequency: fields.payFrequency,
    effectiveDate: fields.effectiveDate,
    endDate: fields.endDate ?? null,
    reason: fields.reason ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const compensationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      payType: data.payType,
      amount: data.amount,
      currency: data.currency,
      payFrequency: data.payFrequency,
      effectiveDate: data.effectiveDate,
      endDate: data.endDate ?? null,
      reason: data.reason ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "compensation"
 *   - employeeId ASC, effectiveDate DESC
 */
