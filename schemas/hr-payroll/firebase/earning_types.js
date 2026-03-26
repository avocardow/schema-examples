// earning_types: configurable earning category definitions for payroll processing.

import { Timestamp } from "firebase/firestore";

export const EARNING_CATEGORY = /** @type {const} */ ({
  REGULAR: "regular",
  OVERTIME: "overtime",
  BONUS: "bonus",
  COMMISSION: "commission",
  REIMBURSEMENT: "reimbursement",
  OTHER: "other",
});

/**
 * @typedef {Object} EarningTypeDocument
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {typeof EARNING_CATEGORY[keyof typeof EARNING_CATEGORY]} category
 * @property {boolean} isTaxable
 * @property {boolean} isActive
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EarningTypeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EarningTypeDocument, "id">}
 */
export function createEarningType(fields) {
  return {
    name:        fields.name,
    code:        fields.code,
    category:    fields.category,
    isTaxable:   fields.isTaxable   ?? true,
    isActive:    fields.isActive    ?? true,
    description: fields.description ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const earningTypeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      code:        data.code,
      category:    data.category,
      isTaxable:   data.isTaxable,
      isActive:    data.isActive,
      description: data.description ?? null,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "earning_types"
 *   - code ASC (unique)
 *   - category ASC
 *   - isActive ASC
 */
