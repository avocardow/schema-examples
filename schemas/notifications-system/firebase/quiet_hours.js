// quiet_hours: Per-user Do Not Disturb schedules with timezone support.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "quiet_hours"
 * Document ID: Firestore auto-generated or UUID
 *
 * Separate from preferences because quiet hours are temporal (when to suppress)
 * while preferences are categorical (what to suppress). During quiet hours,
 * non-critical notifications are held and delivered when quiet hours end.
 * Critical/required notifications still deliver immediately.
 */

/**
 * @typedef {Object} QuietHoursDocument
 * @property {string}          userId       - Reference to the owning user. Cascade-delete when the user is deleted.
 * @property {string}          timezone     - IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo").
 * @property {string}          startTime    - Local time in HH:MM format (e.g., "22:00"). No date component.
 * @property {string}          endTime      - Local time in HH:MM format (e.g., "08:00"). Cross-midnight works naturally.
 * @property {number[]}        daysOfWeek   - Array of ISO day numbers (1=Mon … 7=Sun). e.g., [1,2,3,4,5] = weekdays.
 * @property {boolean}         isActive     - Toggle the schedule without deleting it.
 * @property {Timestamp|null}  snoozeUntil  - Ad-hoc DND override. Null = no active snooze.
 * @property {Timestamp}       createdAt
 * @property {Timestamp}       updatedAt
 */

/**
 * @param {Omit<QuietHoursDocument, "createdAt" | "updatedAt"> & Partial<Pick<QuietHoursDocument, "isActive">>} fields
 * @returns {Omit<QuietHoursDocument, "id">}
 */
export function createQuietHours(fields) {
  return {
    userId:      fields.userId,
    timezone:    fields.timezone,
    startTime:   fields.startTime,
    endTime:     fields.endTime,
    daysOfWeek:  fields.daysOfWeek,
    isActive:    fields.isActive    ?? true,
    snoozeUntil: fields.snoozeUntil ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("quiet_hours").withConverter(quietHoursConverter)
 */
export const quietHoursConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      userId:      data.userId,
      timezone:    data.timezone,
      startTime:   data.startTime,
      endTime:     data.endTime,
      daysOfWeek:  data.daysOfWeek,
      isActive:    data.isActive     ?? true,
      snoozeUntil: data.snoozeUntil  ?? null,   // Timestamp | null
      createdAt:   data.createdAt,              // Timestamp
      updatedAt:   data.updatedAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - quiet_hours.userId              ASC  — "Quiet hours for this user."
 *
 * Composite:
 *   - quiet_hours.userId + isActive   ASC  — "Does this user have active quiet hours?" (checked before every delivery).
 */
