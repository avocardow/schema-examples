// business_schedules: named working-hour schedules used for SLA time calculations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BusinessScheduleDocument
 * @property {string} id
 * @property {string} name
 * @property {string} timezone
 * @property {boolean} isDefault
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BusinessScheduleDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<BusinessScheduleDocument, "id">}
 */
export function createBusinessSchedule(fields) {
  return {
    name: fields.name,
    timezone: fields.timezone,
    isDefault: fields.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const businessScheduleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      timezone: data.timezone,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "business_schedules"
 *   - (no composite indexes needed)
 */
