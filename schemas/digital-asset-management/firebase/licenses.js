// licenses: License templates defining usage rights and restrictions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const LICENSE_TYPE = /** @type {const} */ ({
  ROYALTY_FREE:      "royalty_free",
  RIGHTS_MANAGED:    "rights_managed",
  EDITORIAL:         "editorial",
  CREATIVE_COMMONS:  "creative_commons",
  INTERNAL:          "internal",
  CUSTOM:            "custom",
});

/**
 * @typedef {Object} LicenseDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string} name
 * @property {string|null} description
 * @property {typeof LICENSE_TYPE[keyof typeof LICENSE_TYPE]} licenseType
 * @property {Object|null} territories
 * @property {Object|null} channels
 * @property {number|null} maxUses
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LicenseDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LicenseDocument, "id">}
 */
export function createLicense(fields) {
  return {
    workspaceId: fields.workspaceId,
    name:        fields.name,
    description: fields.description ?? null,
    licenseType: fields.licenseType,
    territories: fields.territories ?? null,
    channels:    fields.channels ?? null,
    maxUses:     fields.maxUses ?? null,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const licenseConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      workspaceId: data.workspaceId,
      name:        data.name,
      description: data.description ?? null,
      licenseType: data.licenseType,
      territories: data.territories ?? null,
      channels:    data.channels ?? null,
      maxUses:     data.maxUses ?? null,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "licenses"
 *   - workspaceId ASC, licenseType ASC
 */
