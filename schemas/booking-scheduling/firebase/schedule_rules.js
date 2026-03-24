// schedule_rules: recurring weekly time blocks defining provider availability.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ScheduleRuleDocument
 * @property {string} id
 * @property {string} scheduleId - FK → schedules
 * @property {number} dayOfWeek
 * @property {string} startTime
 * @property {string} endTime
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ScheduleRuleDocument, "id" | "createdAt">} fields
 */
export function createScheduleRule(fields) {
  return {
    scheduleId: fields.scheduleId,
    dayOfWeek: fields.dayOfWeek,
    startTime: fields.startTime,
    endTime: fields.endTime,
    createdAt: Timestamp.now(),
  };
}

export const scheduleRuleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      scheduleId: data.scheduleId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - scheduleId (ASC), dayOfWeek (ASC) — rules for a schedule by day
 */
