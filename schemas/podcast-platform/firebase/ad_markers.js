// ad_markers: Advertisement insertion points within episodes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MARKER_TYPE = /** @type {const} */ ({
  PREROLL: "preroll",
  MIDROLL: "midroll",
  POSTROLL: "postroll",
});

/**
 * @typedef {Object} AdMarkerDocument
 * @property {string} id
 * @property {string} episodeId - FK → episodes
 * @property {typeof MARKER_TYPE[keyof typeof MARKER_TYPE]} markerType
 * @property {number | null} positionMs
 * @property {number | null} durationMs
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<AdMarkerDocument, "id" | "createdAt">} fields
 * @returns {Omit<AdMarkerDocument, "id">}
 */
export function createAdMarker(fields) {
  return {
    episodeId: fields.episodeId,
    markerType: fields.markerType,
    positionMs: fields.positionMs ?? null,
    durationMs: fields.durationMs ?? null,
    createdAt: Timestamp.now(),
  };
}

export const adMarkerConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      episodeId: data.episodeId,
      markerType: data.markerType,
      positionMs: data.positionMs ?? null,
      durationMs: data.durationMs ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - episodeId ASC, markerType ASC
 */
