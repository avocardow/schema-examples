// renditions: Pre-generated derivative formats of assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RenditionDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string} presetName
 * @property {string} storageKey
 * @property {string} mimeType
 * @property {number} fileSize
 * @property {number|null} width
 * @property {number|null} height
 * @property {string} format
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<RenditionDocument, "id" | "createdAt">} fields
 * @returns {Omit<RenditionDocument, "id">}
 */
export function createRendition(fields) {
  return {
    assetId:    fields.assetId,
    presetName: fields.presetName,
    storageKey: fields.storageKey,
    mimeType:   fields.mimeType,
    fileSize:   fields.fileSize,
    width:      fields.width ?? null,
    height:     fields.height ?? null,
    format:     fields.format,
    createdAt:  Timestamp.now(),
  };
}

export const renditionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      assetId:    data.assetId,
      presetName: data.presetName,
      storageKey: data.storageKey,
      mimeType:   data.mimeType,
      fileSize:   data.fileSize,
      width:      data.width ?? null,
      height:     data.height ?? null,
      format:     data.format,
      createdAt:  data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "renditions"
 *   - assetId ASC, presetName ASC
 */
