// booking_services: line items capturing which services and addons are in a booking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BookingServiceDocument
 * @property {string} id
 * @property {string} bookingId - FK → bookings
 * @property {string | null} serviceId - FK → services
 * @property {string | null} addonId - FK → service_addons
 * @property {string} serviceName
 * @property {number} duration
 * @property {number | null} price
 * @property {string | null} currency
 * @property {boolean} isPrimary
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<BookingServiceDocument, "id" | "createdAt">} fields
 */
export function createBookingService(fields) {
  return {
    bookingId: fields.bookingId,
    serviceId: fields.serviceId ?? null,
    addonId: fields.addonId ?? null,
    serviceName: fields.serviceName,
    duration: fields.duration,
    price: fields.price ?? null,
    currency: fields.currency ?? null,
    isPrimary: fields.isPrimary ?? true,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const bookingServiceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      bookingId: data.bookingId,
      serviceId: data.serviceId ?? null,
      addonId: data.addonId ?? null,
      serviceName: data.serviceName,
      duration: data.duration,
      price: data.price ?? null,
      currency: data.currency ?? null,
      isPrimary: data.isPrimary,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - bookingId (ASC), position (ASC) — services for a booking in order
 * - serviceId (ASC) — bookings using a specific service
 */
