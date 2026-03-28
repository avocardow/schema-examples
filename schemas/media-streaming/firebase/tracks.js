// tracks: individual audio tracks and their metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TrackDocument
 * @property {string} id
 * @property {string} title
 * @property {number} durationMs
 * @property {boolean} explicit
 * @property {string | null} isrc
 * @property {number} popularity
 * @property {string | null} previewUrl
 * @property {number} playCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TrackDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TrackDocument, "id">}
 */
export function createTrack(fields) {
  return {
    title: fields.title,
    durationMs: fields.durationMs,
    explicit: fields.explicit ?? false,
    isrc: fields.isrc ?? null,
    popularity: fields.popularity ?? 0,
    previewUrl: fields.previewUrl ?? null,
    playCount: fields.playCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const trackConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      durationMs: data.durationMs,
      explicit: data.explicit,
      isrc: data.isrc ?? null,
      popularity: data.popularity,
      previewUrl: data.previewUrl ?? null,
      playCount: data.playCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - popularity DESC
 *   - playCount  DESC
 *   - createdAt  DESC
 *   - isrc       ASC
 */
