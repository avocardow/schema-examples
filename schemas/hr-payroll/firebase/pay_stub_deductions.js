// pay_stub_deductions: deduction line items on a pay stub per deduction type.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PayStubDeductionDocument
 * @property {string} id
 * @property {string} payStubId - FK → pay_stubs
 * @property {string} deductionTypeId - FK → deduction_types
 * @property {number} employeeAmount
 * @property {number} employerAmount
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PayStubDeductionDocument, "id" | "createdAt">} fields
 * @returns {Omit<PayStubDeductionDocument, "id">}
 */
export function createPayStubDeduction(fields) {
  return {
    payStubId: fields.payStubId,
    deductionTypeId: fields.deductionTypeId,
    employeeAmount: fields.employeeAmount ?? 0,
    employerAmount: fields.employerAmount ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const payStubDeductionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      payStubId: data.payStubId,
      deductionTypeId: data.deductionTypeId,
      employeeAmount: data.employeeAmount,
      employerAmount: data.employerAmount,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pay_stub_deductions"
 *   - payStubId ASC
 *   - deductionTypeId ASC
 */
