// sla_policies: service-level agreements defining response and resolution time targets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SlaPolicyDocument
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {string | null} scheduleId - FK → business_schedules
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SlaPolicyDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SlaPolicyDocument, "id">}
 */
export function createSlaPolicy(fields) {
  return {
    name: fields.name,
    description: fields.description ?? null,
    isActive: fields.isActive ?? true,
    sortOrder: fields.sortOrder ?? 0,
    scheduleId: fields.scheduleId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const slaPolicyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      scheduleId: data.scheduleId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "sla_policies"
 *   - isActive ASC, sortOrder ASC
 */
