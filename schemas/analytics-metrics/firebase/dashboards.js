// dashboards: Dashboard containers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VISIBILITY = /** @type {const} */ ({
  PRIVATE: "private",
  TEAM:    "team",
  PUBLIC:  "public",
});

/**
 * @typedef {Object} DashboardDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} description
 * @property {Object|null} layout
 * @property {string}      visibility
 * @property {boolean}     isDefault
 * @property {number|null} refreshInterval
 * @property {string}      createdBy        - FK → users
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<DashboardDocument, "name" | "createdBy"> & Partial<Pick<DashboardDocument, "description" | "layout" | "visibility" | "isDefault" | "refreshInterval">>} fields
 * @returns {Omit<DashboardDocument, "id">}
 */
export function createDashboard(fields) {
  return {
    name:            fields.name,
    description:     fields.description     ?? null,
    layout:          fields.layout          ?? null,
    visibility:      fields.visibility      ?? "private",
    isDefault:       fields.isDefault       ?? false,
    refreshInterval: fields.refreshInterval ?? null,
    createdBy:       fields.createdBy,
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  };
}

export const dashboardConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      name:            data.name,
      description:     data.description     ?? null,
      layout:          data.layout          ?? null,
      visibility:      data.visibility,
      isDefault:       data.isDefault,
      refreshInterval: data.refreshInterval ?? null,
      createdBy:       data.createdBy,
      createdAt:       data.createdAt,
      updatedAt:       data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - dashboards.name       ASC
 *   - dashboards.visibility ASC
 *   - dashboards.isDefault  ASC
 *   - dashboards.createdBy  ASC
 */
