// leads: prospective contacts before conversion into the main contact pipeline.
// See README.md for full design rationale.

// Uses CONTACT_SOURCES from contacts.js (redefined here for self-containment).

import { Timestamp } from "firebase/firestore";

export const LEAD_STATUSES = /** @type {const} */ ({
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  UNQUALIFIED: "unqualified",
  CONVERTED: "converted",
});

export const LEAD_SOURCES = /** @type {const} */ ({
  WEB: "web",
  REFERRAL: "referral",
  ORGANIC: "organic",
  PAID: "paid",
  SOCIAL: "social",
  EVENT: "event",
  COLD_OUTREACH: "cold_outreach",
  OTHER: "other",
});

/**
 * @typedef {Object} LeadDocument
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string | null} phone
 * @property {string | null} companyName
 * @property {string | null} title
 * @property {typeof LEAD_SOURCES[keyof typeof LEAD_SOURCES] | null} source
 * @property {typeof LEAD_STATUSES[keyof typeof LEAD_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} convertedAt
 * @property {string | null} convertedContactId - FK → contacts
 * @property {string | null} ownerId - FK → users
 * @property {string | null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LeadDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LeadDocument, "id">}
 */
export function createLead(fields) {
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    phone: fields.phone ?? null,
    companyName: fields.companyName ?? null,
    title: fields.title ?? null,
    source: fields.source ?? null,
    status: fields.status ?? LEAD_STATUSES.NEW,
    convertedAt: fields.convertedAt ?? null,
    convertedContactId: fields.convertedContactId ?? null,
    ownerId: fields.ownerId ?? null,
    notes: fields.notes ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const leadConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      companyName: data.companyName ?? null,
      title: data.title ?? null,
      source: data.source ?? null,
      status: data.status,
      convertedAt: data.convertedAt ?? null,
      convertedContactId: data.convertedContactId ?? null,
      ownerId: data.ownerId ?? null,
      notes: data.notes ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "leads"
 *   - email ASC
 *   - status ASC, createdAt DESC
 *   - ownerId ASC, status ASC, createdAt DESC
 *   - source ASC, createdAt DESC
 */
