// employee_jobs: date-effective job assignments linking employees to positions and departments.

import { Timestamp } from "firebase/firestore";

export const EMPLOYMENT_TYPE = /** @type {const} */ ({
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACTOR: "contractor",
  INTERN: "intern",
  TEMPORARY: "temporary",
});

/**
 * @typedef {Object} EmployeeJobDocument
 * @property {string} id
 * @property {string} employeeId - FK → employees
 * @property {string | null} positionId - FK → positions
 * @property {string} departmentId - FK → departments
 * @property {string | null} managerId - FK → employees
 * @property {string} title
 * @property {typeof EMPLOYMENT_TYPE[keyof typeof EMPLOYMENT_TYPE]} employmentType
 * @property {string} effectiveDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} endDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} reason
 * @property {boolean} isPrimary
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EmployeeJobDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EmployeeJobDocument, "id">}
 */
export function createEmployeeJob(fields) {
  return {
    employeeId: fields.employeeId,
    positionId: fields.positionId ?? null,
    departmentId: fields.departmentId,
    managerId: fields.managerId ?? null,
    title: fields.title,
    employmentType: fields.employmentType,
    effectiveDate: fields.effectiveDate,
    endDate: fields.endDate ?? null,
    reason: fields.reason ?? null,
    isPrimary: fields.isPrimary ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const employeeJobConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      employeeId: data.employeeId,
      positionId: data.positionId ?? null,
      departmentId: data.departmentId,
      managerId: data.managerId ?? null,
      title: data.title,
      employmentType: data.employmentType,
      effectiveDate: data.effectiveDate,
      endDate: data.endDate ?? null,
      reason: data.reason ?? null,
      isPrimary: data.isPrimary,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "employee_jobs"
 *   - employeeId ASC, effectiveDate DESC
 *   - positionId ASC
 *   - departmentId ASC
 *   - managerId ASC
 */
