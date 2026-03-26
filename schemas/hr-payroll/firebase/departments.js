// departments: organizational departments with optional self-referencing hierarchy.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} DepartmentDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} parentId       - FK → departments
 * @property {string}      name
 * @property {string|null} code
 * @property {string|null} description
 * @property {boolean}     isActive
 * @property {import("firebase/firestore").Timestamp}   createdAt
 * @property {import("firebase/firestore").Timestamp}   updatedAt
 */

/**
 * @param {Omit<DepartmentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<DepartmentDocument, "id">}
 */
export function createDepartment(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    parentId:       fields.parentId       ?? null,
    name:           fields.name,
    code:           fields.code           ?? null,
    description:    fields.description    ?? null,
    isActive:       fields.isActive       ?? true,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const departmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      parentId:       data.parentId       ?? null,
      name:           data.name,
      code:           data.code           ?? null,
      description:    data.description    ?? null,
      isActive:       data.isActive,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "departments"
 *   - organizationId ASC, createdAt DESC
 *   - parentId ASC
 *   - isActive ASC
 */
