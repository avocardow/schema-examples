// activities: logged interactions (calls, emails, meetings) tied to CRM entities.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ACTIVITY_TYPES = /** @type {const} */ ({
  CALL: "call",
  EMAIL: "email",
  MEETING: "meeting",
});

/**
 * @typedef {Object} ActivityDocument
 * @property {string} id
 * @property {typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES]} type
 * @property {string} subject
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} occurredAt
 * @property {number | null} duration
 * @property {string | null} contactId - FK → contacts
 * @property {string | null} companyId - FK → companies
 * @property {string | null} dealId - FK → deals
 * @property {string} ownerId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ActivityDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ActivityDocument, "id">}
 */
export function createActivity(fields) {
  return {
    type: fields.type,
    subject: fields.subject,
    description: fields.description ?? null,
    occurredAt: fields.occurredAt,
    duration: fields.duration ?? null,
    contactId: fields.contactId ?? null,
    companyId: fields.companyId ?? null,
    dealId: fields.dealId ?? null,
    ownerId: fields.ownerId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const activityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type,
      subject: data.subject,
      description: data.description ?? null,
      occurredAt: data.occurredAt,
      duration: data.duration ?? null,
      contactId: data.contactId ?? null,
      companyId: data.companyId ?? null,
      dealId: data.dealId ?? null,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "activities"
 *   - contactId ASC, occurredAt DESC
 *   - companyId ASC, occurredAt DESC
 *   - dealId ASC, occurredAt DESC
 *   - ownerId ASC, occurredAt DESC
 *   - type ASC, occurredAt DESC
 */
