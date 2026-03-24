// bookings: scheduled appointments between customers and providers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const BOOKING_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DECLINED: "declined",
  NO_SHOW: "no_show",
});

export const BOOKING_SOURCES = /** @type {const} */ ({
  ONLINE: "online",
  MANUAL: "manual",
  API: "api",
  IMPORT: "import",
});

export const BOOKING_PAYMENT_STATUSES = /** @type {const} */ ({
  NOT_REQUIRED: "not_required",
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
});

/**
 * @typedef {Object} BookingDocument
 * @property {string} id
 * @property {string} providerId - FK → providers
 * @property {string | null} locationId - FK → locations
 * @property {string} customerId - FK → users
 * @property {string | null} scheduleId - FK → schedules
 * @property {import("firebase/firestore").Timestamp} startTime
 * @property {import("firebase/firestore").Timestamp} endTime
 * @property {string} timezone
 * @property {typeof BOOKING_STATUSES[keyof typeof BOOKING_STATUSES]} status
 * @property {string | null} cancelledBy - FK → users
 * @property {string | null} cancellationReason
 * @property {import("firebase/firestore").Timestamp | null} cancelledAt
 * @property {string | null} customerNotes
 * @property {string | null} providerNotes
 * @property {typeof BOOKING_SOURCES[keyof typeof BOOKING_SOURCES]} source
 * @property {typeof BOOKING_PAYMENT_STATUSES[keyof typeof BOOKING_PAYMENT_STATUSES]} paymentStatus
 * @property {string | null} recurrenceGroupId
 * @property {string | null} recurrenceRule
 * @property {import("firebase/firestore").Timestamp | null} confirmedAt
 * @property {import("firebase/firestore").Timestamp | null} completedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BookingDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createBooking(fields) {
  return {
    providerId: fields.providerId,
    locationId: fields.locationId ?? null,
    customerId: fields.customerId,
    scheduleId: fields.scheduleId ?? null,
    startTime: fields.startTime,
    endTime: fields.endTime,
    timezone: fields.timezone,
    status: fields.status ?? BOOKING_STATUSES.PENDING,
    cancelledBy: fields.cancelledBy ?? null,
    cancellationReason: fields.cancellationReason ?? null,
    cancelledAt: fields.cancelledAt ?? null,
    customerNotes: fields.customerNotes ?? null,
    providerNotes: fields.providerNotes ?? null,
    source: fields.source ?? BOOKING_SOURCES.ONLINE,
    paymentStatus: fields.paymentStatus ?? BOOKING_PAYMENT_STATUSES.NOT_REQUIRED,
    recurrenceGroupId: fields.recurrenceGroupId ?? null,
    recurrenceRule: fields.recurrenceRule ?? null,
    confirmedAt: fields.confirmedAt ?? null,
    completedAt: fields.completedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const bookingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      providerId: data.providerId,
      locationId: data.locationId ?? null,
      customerId: data.customerId,
      scheduleId: data.scheduleId ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      timezone: data.timezone,
      status: data.status,
      cancelledBy: data.cancelledBy ?? null,
      cancellationReason: data.cancellationReason ?? null,
      cancelledAt: data.cancelledAt ?? null,
      customerNotes: data.customerNotes ?? null,
      providerNotes: data.providerNotes ?? null,
      source: data.source,
      paymentStatus: data.paymentStatus,
      recurrenceGroupId: data.recurrenceGroupId ?? null,
      recurrenceRule: data.recurrenceRule ?? null,
      confirmedAt: data.confirmedAt ?? null,
      completedAt: data.completedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - providerId (ASC), startTime (ASC) — provider calendar view
 * - customerId (ASC), startTime (DESC) — customer booking history
 * - providerId (ASC), status (ASC), startTime (ASC) — provider filtered by status
 * - status (ASC), startTime (ASC) — admin queue by status
 * - locationId (ASC), startTime (ASC) — location calendar view
 */
