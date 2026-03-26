// benefit_enrollments: employee enrollments in benefit plans with coverage and contribution details.

import { Timestamp } from "firebase/firestore";

export const COVERAGE_LEVEL = /** @type {const} */ ({
  EMPLOYEE_ONLY: "employee_only",
  EMPLOYEE_SPOUSE: "employee_spouse",
  EMPLOYEE_CHILDREN: "employee_children",
  FAMILY: "family",
});

export const ENROLLMENT_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  PENDING: "pending",
  TERMINATED: "terminated",
  WAIVED: "waived",
});

/**
 * @typedef {Object} BenefitEnrollmentDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {string} benefitPlanId - FK → benefit_plans
 * @property {typeof COVERAGE_LEVEL[keyof typeof COVERAGE_LEVEL]} coverageLevel
 * @property {number} employeeContribution - Integer amount in cents
 * @property {number} employerContribution - Integer amount in cents
 * @property {string} currency
 * @property {string} effectiveDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} endDate - Calendar date "YYYY-MM-DD"
 * @property {typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]} status
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BenefitEnrollmentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<BenefitEnrollmentDocument, "id">}
 */
export function createBenefitEnrollment(fields) {
  return {
    employeeId: fields.employeeId,
    benefitPlanId: fields.benefitPlanId,
    coverageLevel: fields.coverageLevel ?? COVERAGE_LEVEL.EMPLOYEE_ONLY,
    employeeContribution: fields.employeeContribution ?? 0,
    employerContribution: fields.employerContribution ?? 0,
    currency: fields.currency ?? "USD",
    effectiveDate: fields.effectiveDate,
    endDate: fields.endDate ?? null,
    status: fields.status ?? ENROLLMENT_STATUS.PENDING,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const benefitEnrollmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      benefitPlanId: data.benefitPlanId,
      coverageLevel: data.coverageLevel,
      employeeContribution: data.employeeContribution,
      employerContribution: data.employerContribution,
      currency: data.currency,
      effectiveDate: data.effectiveDate,
      endDate: data.endDate ?? null,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "benefit_enrollments"
 *   - employeeId ASC, status ASC
 *   - benefitPlanId ASC
 *   - effectiveDate ASC
 */
