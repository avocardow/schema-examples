// contact_tag_assignments: Junction table linking contacts to tags.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ContactTagAssignmentDocument
 * @property {string} id
 * @property {string} contactId - FK → contacts
 * @property {string} tagId - FK → tags
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ContactTagAssignmentDocument, "id" | "createdAt">} fields
 * @returns {Omit<ContactTagAssignmentDocument, "id">}
 */
export function createContactTagAssignment(fields) {
  return {
    contactId: fields.contactId,
    tagId:     fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const contactTagAssignmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      contactId: data.contactId,
      tagId:     data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - contact_tag_assignments (contactId ASC, tagId ASC)  — Enforce uniqueness per contact-tag pair.
 *
 * Single-field:
 *   - contact_tag_assignments.tagId  ASC  — Find all contacts for a given tag.
 */
