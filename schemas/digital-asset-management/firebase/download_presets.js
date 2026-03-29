// download_presets: Predefined download format and quality configurations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} DownloadPresetDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string} name
 * @property {string|null} outputFormat
 * @property {number|null} maxWidth
 * @property {number|null} maxHeight
 * @property {number|null} quality
 * @property {number|null} dpi
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<DownloadPresetDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<DownloadPresetDocument, "id">}
 */
export function createDownloadPreset(fields) {
  return {
    workspaceId:  fields.workspaceId,
    name:         fields.name,
    outputFormat: fields.outputFormat ?? null,
    maxWidth:     fields.maxWidth ?? null,
    maxHeight:    fields.maxHeight ?? null,
    quality:      fields.quality ?? null,
    dpi:          fields.dpi ?? null,
    createdBy:    fields.createdBy,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

export const downloadPresetConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      workspaceId:  data.workspaceId,
      name:         data.name,
      outputFormat: data.outputFormat ?? null,
      maxWidth:     data.maxWidth ?? null,
      maxHeight:    data.maxHeight ?? null,
      quality:      data.quality ?? null,
      dpi:          data.dpi ?? null,
      createdBy:    data.createdBy,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "download_presets"
 *   - workspaceId ASC, name ASC
 */
