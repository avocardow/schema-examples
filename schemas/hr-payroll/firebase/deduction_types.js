// deduction_types: configurable deduction category definitions for payroll processing.

import { Timestamp } from "firebase/firestore";

export const DEDUCTION_CATEGORY = /** @type {const} */ ({
  TAX: "tax",
  RETIREMENT: "retirement",
  INSURANCE: "insurance",
  GARNISHMENT: "garnishment",
  OTHER: "other",
});

/**
 * @typedef {Object} DeductionTypeDocument
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {typeof DEDUCTION_CATEGORY[keyof typeof DEDUCTION_CATEGORY]} category
 * @property {boolean} isPretax
 * @property {boolean} isActive
 * @property {string | null} description
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<DeductionTypeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<DeductionTypeDocument, "id">}
 */
export function createDeductionType(fields) {
  return {
    name: fields.name,
    code: fields.code,
    category: fields.category,
    isPretax: fields.isPretax ?? false,
    isActive: fields.isActive ?? true,
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const deductionTypeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      code: data.code,
      category: data.category,
      isPretax: data.isPretax,
      isActive: data.isActive,
      description: data.description ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "deduction_types"
 *   - code ASC (unique)
 *   - category ASC
 *   - isActive ASC
 */
