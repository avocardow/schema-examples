// framework_requirements: individual requirements within a compliance framework (tree via parentId).

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FrameworkRequirementDocument
 * @property {string}      id
 * @property {string}      frameworkId - FK → frameworks
 * @property {string|null} parentId    - FK → framework_requirements
 * @property {string}      identifier
 * @property {string}      title
 * @property {string|null} description
 * @property {number}      sortOrder
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<FrameworkRequirementDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FrameworkRequirementDocument, "id">}
 */
export function createFrameworkRequirement(fields) {
  return {
    frameworkId: fields.frameworkId,
    parentId:    fields.parentId    ?? null,
    identifier:  fields.identifier,
    title:       fields.title,
    description: fields.description ?? null,
    sortOrder:   fields.sortOrder   ?? 0,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const frameworkRequirementConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      frameworkId: data.frameworkId,
      parentId:    data.parentId    ?? null,
      identifier:  data.identifier,
      title:       data.title,
      description: data.description ?? null,
      sortOrder:   data.sortOrder,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "framework_requirements"
 *   - frameworkId ASC, identifier ASC (unique)
 *   - parentId ASC
 *   - sortOrder ASC
 */
