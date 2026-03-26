// positions: job position definitions with level and pay grade classification.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PositionDocument
 * @property {string}      id
 * @property {string|null} departmentId  - FK → departments
 * @property {string}      title
 * @property {string|null} code
 * @property {string|null} description
 * @property {number|null} level
 * @property {string|null} payGrade
 * @property {boolean}     isActive
 * @property {import("firebase/firestore").Timestamp}   createdAt
 * @property {import("firebase/firestore").Timestamp}   updatedAt
 */

/**
 * @param {Omit<PositionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PositionDocument, "id">}
 */
export function createPosition(fields) {
  const now = Timestamp.now();
  return {
    departmentId: fields.departmentId ?? null,
    title:        fields.title,
    code:         fields.code        ?? null,
    description:  fields.description ?? null,
    level:        fields.level       ?? null,
    payGrade:     fields.payGrade    ?? null,
    isActive:     fields.isActive    ?? true,
    createdAt:    now,
    updatedAt:    now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("positions").withConverter(positionConverter)
 */
export const positionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      departmentId: data.departmentId ?? null,
      title:        data.title,
      code:         data.code        ?? null,
      description:  data.description ?? null,
      level:        data.level       ?? null,
      payGrade:     data.payGrade    ?? null,
      isActive:     data.isActive,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - positions.departmentId  ASC  — "List all positions in this department."
 *   - positions.isActive      ASC  — "Filter active vs. inactive positions."
 */
