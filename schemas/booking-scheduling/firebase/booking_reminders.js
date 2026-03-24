// booking_reminders: scheduled notifications sent before a booking starts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const REMINDER_TARGETS = /** @type {const} */ ({
  CUSTOMER: "customer",
  PROVIDER: "provider",
  ALL: "all",
});

export const REMINDER_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} BookingReminderDocument
 * @property {string} id
 * @property {string} bookingId - FK → bookings
 * @property {import("firebase/firestore").Timestamp} remindAt
 * @property {typeof REMINDER_TARGETS[keyof typeof REMINDER_TARGETS]} type
 * @property {number} offsetMinutes
 * @property {typeof REMINDER_STATUSES[keyof typeof REMINDER_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} sentAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BookingReminderDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createBookingReminder(fields) {
  return {
    bookingId: fields.bookingId,
    remindAt: fields.remindAt,
    type: fields.type ?? REMINDER_TARGETS.CUSTOMER,
    offsetMinutes: fields.offsetMinutes,
    status: fields.status ?? REMINDER_STATUSES.PENDING,
    sentAt: fields.sentAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const bookingReminderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      bookingId: data.bookingId,
      remindAt: data.remindAt,
      type: data.type,
      offsetMinutes: data.offsetMinutes,
      status: data.status,
      sentAt: data.sentAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - bookingId (ASC) — reminders for a booking
 * - status (ASC), remindAt (ASC) — pending reminders due for sending
 */
