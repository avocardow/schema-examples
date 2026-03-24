// booking_attendees: individuals attending a group or multi-party booking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ATTENDEE_STATUSES = /** @type {const} */ ({
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
});

/**
 * @typedef {Object} BookingAttendeeDocument
 * @property {string} id
 * @property {string} bookingId - FK → bookings
 * @property {string | null} userId - FK → users
 * @property {string} name
 * @property {string} email
 * @property {string | null} phone
 * @property {typeof ATTENDEE_STATUSES[keyof typeof ATTENDEE_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} cancelledAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BookingAttendeeDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createBookingAttendee(fields) {
  return {
    bookingId: fields.bookingId,
    userId: fields.userId ?? null,
    name: fields.name,
    email: fields.email,
    phone: fields.phone ?? null,
    status: fields.status ?? ATTENDEE_STATUSES.CONFIRMED,
    cancelledAt: fields.cancelledAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const bookingAttendeeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      bookingId: data.bookingId,
      userId: data.userId ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      status: data.status,
      cancelledAt: data.cancelledAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - bookingId (ASC), status (ASC) — attendees for a booking by status
 * - userId (ASC), status (ASC) — bookings for a user
 * - email (ASC) — lookup attendee by email
 */
