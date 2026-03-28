// track_files: audio file variants for tracks at different quality levels.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TRACK_QUALITY = /** @type {const} */ ({
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  LOSSLESS: "lossless",
});

/**
 * @typedef {Object} TrackFileDocument
 * @property {string} id
 * @property {string} trackId - FK → tracks
 * @property {string} fileId - FK → files
 * @property {typeof TRACK_QUALITY[keyof typeof TRACK_QUALITY]} quality
 * @property {string} codec
 * @property {number | null} bitrateKbps
 * @property {number | null} sampleRateHz
 * @property {number} fileSizeBytes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TrackFileDocument, "id" | "createdAt">} fields
 * @returns {Omit<TrackFileDocument, "id">}
 */
export function createTrackFile(fields) {
  return {
    trackId: fields.trackId,
    fileId: fields.fileId,
    quality: fields.quality,
    codec: fields.codec,
    bitrateKbps: fields.bitrateKbps ?? null,
    sampleRateHz: fields.sampleRateHz ?? null,
    fileSizeBytes: fields.fileSizeBytes,
    createdAt: Timestamp.now(),
  };
}

export const trackFileConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      trackId: data.trackId,
      fileId: data.fileId,
      quality: data.quality,
      codec: data.codec,
      bitrateKbps: data.bitrateKbps ?? null,
      sampleRateHz: data.sampleRateHz ?? null,
      fileSizeBytes: data.fileSizeBytes,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - trackId ASC, quality ASC
 *   - trackId ASC, codec ASC
 */
