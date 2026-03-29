// asset_versions: Tracks version history for each asset.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AssetVersionDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {number} versionNumber
 * @property {string} storageKey
 * @property {string} mimeType
 * @property {number} fileSize
 * @property {string} fileExtension
 * @property {string|null} checksumSha256
 * @property {string|null} changeSummary
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<AssetVersionDocument, "id" | "createdAt">} fields
 * @returns {Omit<AssetVersionDocument, "id">}
 */
export function createAssetVersion(fields) {
  return {
    assetId:        fields.assetId,
    versionNumber:  fields.versionNumber,
    storageKey:     fields.storageKey,
    mimeType:       fields.mimeType,
    fileSize:       fields.fileSize,
    fileExtension:  fields.fileExtension,
    checksumSha256: fields.checksumSha256 ?? null,
    changeSummary:  fields.changeSummary ?? null,
    createdBy:      fields.createdBy,
    createdAt:      Timestamp.now(),
  };
}

export const assetVersionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      assetId:        data.assetId,
      versionNumber:  data.versionNumber,
      storageKey:     data.storageKey,
      mimeType:       data.mimeType,
      fileSize:       data.fileSize,
      fileExtension:  data.fileExtension,
      checksumSha256: data.checksumSha256 ?? null,
      changeSummary:  data.changeSummary ?? null,
      createdBy:      data.createdBy,
      createdAt:      data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "asset_versions"
 *   - assetId ASC, versionNumber ASC
 */
