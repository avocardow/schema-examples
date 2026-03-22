// screenshots: Visual context images linked to translation keys.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ScreenshotDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string}      filePath
 * @property {number|null} fileSize
 * @property {string|null} mimeType
 * @property {number|null} width
 * @property {number|null} height
 * @property {string|null} uploadedBy
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<ScreenshotDocument, "name" | "filePath"> & Partial<Pick<ScreenshotDocument, "fileSize" | "mimeType" | "width" | "height" | "uploadedBy">>} fields
 * @returns {Omit<ScreenshotDocument, "id">}
 */
export function createScreenshot(fields) {
  return {
    name:       fields.name,
    filePath:   fields.filePath,
    fileSize:   fields.fileSize   ?? null,
    mimeType:   fields.mimeType   ?? null,
    width:      fields.width      ?? null,
    height:     fields.height     ?? null,
    uploadedBy: fields.uploadedBy ?? null,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

export const screenshotConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      name:       data.name,
      filePath:   data.filePath,
      fileSize:   data.fileSize   ?? null,
      mimeType:   data.mimeType   ?? null,
      width:      data.width      ?? null,
      height:     data.height     ?? null,
      uploadedBy: data.uploadedBy ?? null,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - screenshots.uploadedBy ASC
 */
