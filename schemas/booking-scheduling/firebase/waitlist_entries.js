// waitlist_entries: customers waiting for availability on a service or provider.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const WAITLIST_STATUSES = /** @type {const} */ ({
  WAITING: "waiting",
  NOTIFIED: "notified",
  BOOKED: "booked",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} WaitlistEntryDocument
 * @property {string} id
 * @property {string} serviceId - FK → services
 * @property {string | null} providerId - FK → providers
 * @property {string} customerId - FK → users
 * @property {string | null} locationId - FK → locations
 * @property {string} preferredDate
 * @property {string | null} preferredStart
 * @property {string | null} preferredEnd
 * @property {typeof WAITLIST_STATUSES[keyof typeof WAITLIST_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} notifiedAt
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {string | null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<WaitlistEntryDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createWaitlistEntry(fields) {
  return {
    serviceId: fields.serviceId,
    providerId: fields.providerId ?? null,
    customerId: fields.customerId,
    locationId: fields.locationId ?? null,
    preferredDate: fields.preferredDate,
    preferredStart: fields.preferredStart ?? null,
    preferredEnd: fields.preferredEnd ?? null,
    status: fields.status ?? WAITLIST_STATUSES.WAITING,
    notifiedAt: fields.notifiedAt ?? null,
    expiresAt: fields.expiresAt ?? null,
    notes: fields.notes ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const waitlistEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      serviceId: data.serviceId,
      providerId: data.providerId ?? null,
      customerId: data.customerId,
      locationId: data.locationId ?? null,
      preferredDate: data.preferredDate,
      preferredStart: data.preferredStart ?? null,
      preferredEnd: data.preferredEnd ?? null,
      status: data.status,
      notifiedAt: data.notifiedAt ?? null,
      expiresAt: data.expiresAt ?? null,
      notes: data.notes ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - serviceId (ASC), status (ASC), createdAt (ASC) — waitlist queue by service
 * - customerId (ASC), status (ASC) — customer's waitlist entries
 * - providerId (ASC), status (ASC), preferredDate (ASC) — provider waitlist by date
 * - status (ASC), expiresAt (ASC) — expiring entries for cleanup
 */
