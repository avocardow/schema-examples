// employees: Core workforce record linking a person to their employment details.

import { Timestamp } from "firebase/firestore";

export const EMPLOYMENT_TYPE = /** @type {const} */ ({
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACTOR: "contractor",
  INTERN: "intern",
  TEMPORARY: "temporary",
});

export const EMPLOYEE_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  ON_LEAVE: "on_leave",
  SUSPENDED: "suspended",
  TERMINATED: "terminated",
});

/**
 * @typedef {Object} EmployeeDocument
 * @property {string} id
 * @property {string | null} userId - FK → users
 * @property {string | null} employeeNumber
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string | null} phone
 * @property {string | null} dateOfBirth - Calendar date "YYYY-MM-DD"
 * @property {string} hireDate - Calendar date "YYYY-MM-DD"
 * @property {string | null} terminationDate - Calendar date "YYYY-MM-DD"
 * @property {typeof EMPLOYMENT_TYPE[keyof typeof EMPLOYMENT_TYPE]} employmentType
 * @property {typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS]} status
 * @property {Object | null} metadata
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EmployeeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EmployeeDocument, "id">}
 */
export function createEmployee(fields) {
  return {
    userId: fields.userId ?? null,
    employeeNumber: fields.employeeNumber ?? null,
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    phone: fields.phone ?? null,
    dateOfBirth: fields.dateOfBirth ?? null,
    hireDate: fields.hireDate,
    terminationDate: fields.terminationDate ?? null,
    employmentType: fields.employmentType,
    status: fields.status ?? EMPLOYEE_STATUS.ACTIVE,
    metadata: fields.metadata ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const employeeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId ?? null,
      employeeNumber: data.employeeNumber ?? null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      hireDate: data.hireDate,
      terminationDate: data.terminationDate ?? null,
      employmentType: data.employmentType,
      status: data.status,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "employees"
 *   - employeeNumber ASC (unique)
 *   - userId ASC
 *   - status ASC, createdAt DESC
 *   - employmentType ASC, status ASC, createdAt DESC
 */
