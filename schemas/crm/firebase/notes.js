// notes: freeform text notes attached to contacts, companies, deals, or leads.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} NoteDocument
 * @property {string} id
 * @property {string} content
 * @property {string | null} contactId - FK → contacts
 * @property {string | null} companyId - FK → companies
 * @property {string | null} dealId - FK → deals
 * @property {string | null} leadId - FK → leads
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<NoteDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NoteDocument, "id">}
 */
export function createNote(fields) {
  return {
    content: fields.content,
    contactId: fields.contactId ?? null,
    companyId: fields.companyId ?? null,
    dealId: fields.dealId ?? null,
    leadId: fields.leadId ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const noteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      content: data.content,
      contactId: data.contactId ?? null,
      companyId: data.companyId ?? null,
      dealId: data.dealId ?? null,
      leadId: data.leadId ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "notes"
 *   - contactId ASC, createdAt DESC
 *   - companyId ASC, createdAt DESC
 *   - dealId ASC, createdAt DESC
 *   - leadId ASC, createdAt DESC
 *   - createdBy ASC, createdAt DESC
 */
