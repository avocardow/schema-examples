// schedules: named availability templates assigned to providers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ScheduleDocument
 * @property {string} id
 * @property {string} providerId - FK → providers
 * @property {string} name
 * @property {string} timezone
 * @property {boolean} isDefault
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ScheduleDocument, "id" | "createdAt" | "updatedAt">} fields
 */
export function createSchedule(fields) {
  return {
    providerId: fields.providerId,
    name: fields.name,
    timezone: fields.timezone,
    isDefault: fields.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const scheduleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      providerId: data.providerId,
      name: data.name,
      timezone: data.timezone,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 * - providerId (ASC), isDefault (DESC) — schedules for a provider, default first
 */
