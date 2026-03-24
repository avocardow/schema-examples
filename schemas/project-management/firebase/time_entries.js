// time_entries: tracked time records for tasks logged by users.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TimeEntryDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string} userId - FK → users
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp | null} startTime
 * @property {import("firebase/firestore").Timestamp | null} endTime
 * @property {number} duration
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TimeEntryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TimeEntryDocument, "id">}
 */
export function createTimeEntry(fields) {
  return {
    taskId: fields.taskId,
    userId: fields.userId,
    description: fields.description ?? null,
    startTime: fields.startTime ?? null,
    endTime: fields.endTime ?? null,
    duration: fields.duration,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const timeEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      userId: data.userId,
      description: data.description ?? null,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      duration: data.duration,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "time_entries"
 *   - taskId ASC
 *   - userId ASC, startTime DESC
 */
