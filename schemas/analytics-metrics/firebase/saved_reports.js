// saved_reports: Saved query configurations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VISIBILITY = /** @type {const} */ ({
  PRIVATE: "private",
  TEAM:    "team",
  PUBLIC:  "public",
});

/**
 * @typedef {Object} SavedReportDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} description
 * @property {Object}      config
 * @property {string}      visibility
 * @property {string}      createdBy    - FK → users
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<SavedReportDocument, "name" | "config" | "createdBy"> & Partial<Pick<SavedReportDocument, "description" | "visibility">>} fields
 * @returns {Omit<SavedReportDocument, "id">}
 */
export function createSavedReport(fields) {
  return {
    name:        fields.name,
    description: fields.description ?? null,
    config:      fields.config,
    visibility:  fields.visibility  ?? "private",
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const savedReportConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      description: data.description ?? null,
      config:      data.config,
      visibility:  data.visibility,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - saved_reports.name       ASC
 *   - saved_reports.visibility ASC
 *   - saved_reports.createdBy  ASC
 *
 * Composite:
 *   - saved_reports.createdBy ASC, saved_reports.updatedAt DESC
 */
