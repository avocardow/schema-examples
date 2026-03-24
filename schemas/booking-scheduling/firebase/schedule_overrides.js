// schedule_overrides: date-specific exceptions to recurring schedule rules.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ScheduleOverrideDocument
 * @property {string} id
 * @property {string} scheduleId - FK → schedules
 * @property {string} overrideDate
 * @property {string | null} startTime
 * @property {string | null} endTime
 * @property {boolean} isAvailable
 * @property {string | null} reason
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ScheduleOverrideDocument, "id" | "createdAt">} fields
 */
export function createScheduleOverride(fields) {
  return {
    scheduleId: fields.scheduleId,
    overrideDate: fields.overrideDate,
    startTime: fields.startTime ?? null,
    endTime: fields.endTime ?? null,
    isAvailable: fields.isAvailable ?? true,
    reason: fields.reason ?? null,
    createdAt: Timestamp.now(),
  };
}

export const scheduleOverrideConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      scheduleId: data.scheduleId,
      overrideDate: data.overrideDate,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      isAvailable: data.isAvailable,
      reason: data.reason ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - scheduleId (ASC), overrideDate (ASC) — overrides for a schedule by date
 */
