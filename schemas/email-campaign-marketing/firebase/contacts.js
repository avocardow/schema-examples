// contacts: Email contacts with subscription status and metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONTACT_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  UNSUBSCRIBED: "unsubscribed",
  BOUNCED: "bounced",
  COMPLAINED: "complained",
});

/**
 * @typedef {Object} ContactDocument
 * @property {string} id
 * @property {string} email
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {typeof CONTACT_STATUS[keyof typeof CONTACT_STATUS]} status
 * @property {Object|null} metadata
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ContactDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ContactDocument, "id">}
 */
export function createContact(fields) {
  const now = Timestamp.now();
  return {
    email:     fields.email,
    firstName: fields.firstName ?? null,
    lastName:  fields.lastName  ?? null,
    status:    fields.status    ?? CONTACT_STATUS.ACTIVE,
    metadata:  fields.metadata  ?? {},
    createdBy: fields.createdBy ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export const contactConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      email:     data.email,
      firstName: data.firstName ?? null,
      lastName:  data.lastName  ?? null,
      status:    data.status,
      metadata:  data.metadata  ?? null,
      createdBy: data.createdBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - contacts.status     ASC  — Filter contacts by subscription status.
 *   - contacts.createdAt  ASC  — Sort contacts by creation date.
 */
