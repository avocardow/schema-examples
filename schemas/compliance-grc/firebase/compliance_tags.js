// compliance_tags: tagging taxonomy for organizing compliance entities.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ComplianceTagDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string}      name
 * @property {string|null} color
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ComplianceTagDocument, "id" | "createdAt">} fields
 * @returns {Omit<ComplianceTagDocument, "id">}
 */
export function createComplianceTag(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    name:           fields.name,
    color:          fields.color ?? null,
    createdAt:      Timestamp.now(),
  };
}

export const complianceTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      name:           data.name,
      color:          data.color ?? null,
      createdAt:      data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "compliance_tags"
 *   - organizationId ASC, name ASC (unique)
 */
