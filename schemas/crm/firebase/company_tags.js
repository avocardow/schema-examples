// company_tags: join table linking companies to tags.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CompanyTagDocument
 * @property {string} id
 * @property {string} companyId - FK → companies
 * @property {string} tagId - FK → tags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<CompanyTagDocument, "id" | "createdAt">} fields
 * @returns {Omit<CompanyTagDocument, "id">}
 */
export function createCompanyTag(fields) {
  return {
    companyId: fields.companyId,
    tagId: fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const companyTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      companyId: data.companyId,
      tagId: data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "company_tags"
 *   - companyId ASC, tagId ASC (unique)
 *   - tagId ASC, createdAt DESC
 */
