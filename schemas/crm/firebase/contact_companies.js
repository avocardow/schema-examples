// contact_companies: join table linking contacts to companies with role info.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ContactCompanyDocument
 * @property {string} id
 * @property {string} contactId - FK → contacts
 * @property {string} companyId - FK → companies
 * @property {string | null} role
 * @property {boolean} isPrimary
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ContactCompanyDocument, "id" | "createdAt">} fields
 * @returns {Omit<ContactCompanyDocument, "id">}
 */
export function createContactCompany(fields) {
  return {
    contactId: fields.contactId,
    companyId: fields.companyId,
    role: fields.role ?? null,
    isPrimary: fields.isPrimary ?? false,
    createdAt: Timestamp.now(),
  };
}

export const contactCompanyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      contactId: data.contactId,
      companyId: data.companyId,
      role: data.role ?? null,
      isPrimary: data.isPrimary,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "contact_companies"
 *   - contactId ASC, isPrimary DESC
 *   - companyId ASC, createdAt DESC
 */
