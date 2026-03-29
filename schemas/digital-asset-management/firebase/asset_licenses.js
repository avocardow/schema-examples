// asset_licenses: Associates license terms with individual assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AssetLicenseDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string} licenseId - FK → licenses
 * @property {string} effectiveDate
 * @property {string|null} expiryDate
 * @property {string|null} notes
 * @property {string} assignedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AssetLicenseDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AssetLicenseDocument, "id">}
 */
export function createAssetLicense(fields) {
  return {
    assetId:       fields.assetId,
    licenseId:     fields.licenseId,
    effectiveDate: fields.effectiveDate,
    expiryDate:    fields.expiryDate ?? null,
    notes:         fields.notes ?? null,
    assignedBy:    fields.assignedBy,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const assetLicenseConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      assetId:       data.assetId,
      licenseId:     data.licenseId,
      effectiveDate: data.effectiveDate,
      expiryDate:    data.expiryDate ?? null,
      notes:         data.notes ?? null,
      assignedBy:    data.assignedBy,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "asset_licenses"
 *   - assetId ASC
 *   - licenseId ASC
 */
