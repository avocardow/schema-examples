// contacts: individual people tracked in the CRM with lifecycle and ownership.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONTACT_LIFECYCLE_STAGES = /** @type {const} */ ({
  SUBSCRIBER: "subscriber",
  LEAD: "lead",
  QUALIFIED: "qualified",
  OPPORTUNITY: "opportunity",
  CUSTOMER: "customer",
  EVANGELIST: "evangelist",
  OTHER: "other",
});

export const CONTACT_SOURCES = /** @type {const} */ ({
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
 * @typedef {Object} ContactDocument
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string | null} phone
 * @property {string | null} title
 * @property {typeof CONTACT_LIFECYCLE_STAGES[keyof typeof CONTACT_LIFECYCLE_STAGES]} lifecycleStage
 * @property {typeof CONTACT_SOURCES[keyof typeof CONTACT_SOURCES] | null} source
 * @property {string | null} ownerId - FK → users
 * @property {string | null} avatarUrl
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ContactDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ContactDocument, "id">}
 */
export function createContact(fields) {
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    phone: fields.phone ?? null,
    title: fields.title ?? null,
    lifecycleStage: fields.lifecycleStage ?? CONTACT_LIFECYCLE_STAGES.LEAD,
    source: fields.source ?? null,
    ownerId: fields.ownerId ?? null,
    avatarUrl: fields.avatarUrl ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const contactConverter = {
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
      title: data.title ?? null,
      lifecycleStage: data.lifecycleStage,
      source: data.source ?? null,
      ownerId: data.ownerId ?? null,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "contacts"
 *   - email ASC (unique)
 *   - ownerId ASC, createdAt DESC
 *   - lifecycleStage ASC, createdAt DESC
 *   - source ASC, createdAt DESC
 */
