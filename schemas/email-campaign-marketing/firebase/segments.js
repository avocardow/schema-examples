// segments: Dynamic audience segments defined by filter criteria.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SegmentDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {Object} filterCriteria
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SegmentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SegmentDocument, "id">}
 */
export function createSegment(fields) {
  const now = Timestamp.now();
  return {
    name:           fields.name,
    description:    fields.description ?? null,
    filterCriteria: fields.filterCriteria,
    createdBy:      fields.createdBy ?? null,
    createdAt:      now,
    updatedAt:      now,
  };
}

export const segmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      name:           data.name,
      description:    data.description ?? null,
      filterCriteria: data.filterCriteria,
      createdBy:      data.createdBy   ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - segments.createdBy  ASC  — Filter segments by creator.
 */
