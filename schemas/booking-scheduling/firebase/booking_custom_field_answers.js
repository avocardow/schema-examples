// booking_custom_field_answers: customer responses to custom intake form fields.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BookingCustomFieldAnswerDocument
 * @property {string} id
 * @property {string} bookingId - FK → bookings
 * @property {string} customFieldId - FK → custom_fields
 * @property {string} value
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<BookingCustomFieldAnswerDocument, "id" | "createdAt">} fields
 */
export function createBookingCustomFieldAnswer(fields) {
  return {
    bookingId: fields.bookingId,
    customFieldId: fields.customFieldId,
    value: fields.value,
    createdAt: Timestamp.now(),
  };
}

export const bookingCustomFieldAnswerConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      bookingId: data.bookingId,
      customFieldId: data.customFieldId,
      value: data.value,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - bookingId (ASC) — answers for a booking
 * - customFieldId (ASC) — answers for a specific field
 */
