// pay_schedules: pay period frequency definitions for organizing payroll runs.

import { Timestamp } from "firebase/firestore";

export const PAY_SCHEDULE_FREQUENCY = /** @type {const} */ ({
  WEEKLY: "weekly",
  BIWEEKLY: "biweekly",
  SEMIMONTHLY: "semimonthly",
  MONTHLY: "monthly",
});

/**
 * @typedef {Object} PayScheduleDocument
 * @property {string} id
 * @property {string} name
 * @property {typeof PAY_SCHEDULE_FREQUENCY[keyof typeof PAY_SCHEDULE_FREQUENCY]} frequency
 * @property {string} anchorDate - Calendar date "YYYY-MM-DD"
 * @property {boolean} isActive
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PayScheduleDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PayScheduleDocument, "id">}
 */
export function createPaySchedule(fields) {
  return {
    name: fields.name,
    frequency: fields.frequency,
    anchorDate: fields.anchorDate,
    isActive: fields.isActive ?? true,
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const payScheduleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      frequency: data.frequency,
      anchorDate: data.anchorDate,
      isActive: data.isActive,
      description: data.description ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "pay_schedules"
 *   - frequency ASC
 *   - isActive ASC
 */
