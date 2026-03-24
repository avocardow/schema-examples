// contact_tags: join table linking contacts to tags.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ContactTagDocument
 * @property {string} id
 * @property {string} contactId - FK → contacts
 * @property {string} tagId - FK → tags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ContactTagDocument, "id" | "createdAt">} fields
 * @returns {Omit<ContactTagDocument, "id">}
 */
export function createContactTag(fields) {
  return {
    contactId: fields.contactId,
    tagId: fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const contactTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      contactId: data.contactId,
      tagId: data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "contact_tags"
 *   - contactId ASC, tagId ASC (unique)
 *   - tagId ASC, createdAt DESC
 */
