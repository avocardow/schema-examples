// asset_downloads: Tracks individual asset download events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AssetDownloadDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string|null} downloadedBy - FK → users
 * @property {string|null} shareLinkId - FK → share_links
 * @property {string|null} presetId - FK → download_presets
 * @property {string} format
 * @property {number} fileSize
 * @property {string|null} ipAddress
 * @property {string|null} userAgent
 * @property {import("firebase/firestore").Timestamp} downloadedAt
 */

/**
 * @param {Omit<AssetDownloadDocument, "id" | "downloadedAt">} fields
 * @returns {Omit<AssetDownloadDocument, "id">}
 */
export function createAssetDownload(fields) {
  return {
    assetId:      fields.assetId,
    downloadedBy: fields.downloadedBy ?? null,
    shareLinkId:  fields.shareLinkId ?? null,
    presetId:     fields.presetId ?? null,
    format:       fields.format,
    fileSize:     fields.fileSize,
    ipAddress:    fields.ipAddress ?? null,
    userAgent:    fields.userAgent ?? null,
    downloadedAt: Timestamp.now(),
  };
}

export const assetDownloadConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      assetId:      data.assetId,
      downloadedBy: data.downloadedBy ?? null,
      shareLinkId:  data.shareLinkId ?? null,
      presetId:     data.presetId ?? null,
      format:       data.format,
      fileSize:     data.fileSize,
      ipAddress:    data.ipAddress ?? null,
      userAgent:    data.userAgent ?? null,
      downloadedAt: data.downloadedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "asset_downloads"
 *   - assetId ASC, downloadedAt DESC
 *   - downloadedBy ASC
 *   - shareLinkId ASC
 */
