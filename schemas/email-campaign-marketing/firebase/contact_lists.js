// contact_lists: Named mailing lists that group contacts for targeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ContactListDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ContactListDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ContactListDocument, "id">}
 */
export function createContactList(fields) {
  const now = Timestamp.now();
  return {
    name:        fields.name,
    description: fields.description ?? null,
    createdBy:   fields.createdBy   ?? null,
    createdAt:   now,
    updatedAt:   now,
  };
}

export const contactListConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      description: data.description ?? null,
      createdBy:   data.createdBy   ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - contact_lists.createdBy  ASC  — Filter lists by creator.
 */
