// funnels: Conversion funnels.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FunnelDocument
 * @property {string}    id
 * @property {string}    name
 * @property {string|null} description
 * @property {number}    conversionWindow
 * @property {boolean}   isActive
 * @property {string}    createdBy        - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Pick<FunnelDocument, "name" | "createdBy"> & Partial<Pick<FunnelDocument, "description" | "conversionWindow" | "isActive">>} fields
 * @returns {Omit<FunnelDocument, "id">}
 */
export function createFunnel(fields) {
  return {
    name:             fields.name,
    description:      fields.description      ?? null,
    conversionWindow: fields.conversionWindow ?? 86400,
    isActive:         fields.isActive         ?? true,
    createdBy:        fields.createdBy,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

export const funnelConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      name:             data.name,
      description:      data.description      ?? null,
      conversionWindow: data.conversionWindow,
      isActive:         data.isActive,
      createdBy:        data.createdBy,
      createdAt:        data.createdAt,
      updatedAt:        data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - funnels.name      ASC
 *   - funnels.isActive  ASC
 *   - funnels.createdBy ASC
 */
