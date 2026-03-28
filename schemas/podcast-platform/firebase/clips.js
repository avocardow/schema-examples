// clips: User-created audio clips from episodes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ClipDocument
 * @property {string} id
 * @property {string} episodeId - FK → episodes
 * @property {string} createdBy - FK → users
 * @property {string} title
 * @property {number} startTimeMs
 * @property {number} durationMs
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ClipDocument, "id" | "createdAt">} fields
 * @returns {Omit<ClipDocument, "id">}
 */
export function createClip(fields) {
  return {
    episodeId: fields.episodeId,
    createdBy: fields.createdBy,
    title: fields.title,
    startTimeMs: fields.startTimeMs,
    durationMs: fields.durationMs,
    createdAt: Timestamp.now(),
  };
}

export const clipConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      episodeId: data.episodeId,
      createdBy: data.createdBy,
      title: data.title,
      startTimeMs: data.startTimeMs,
      durationMs: data.durationMs,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - episodeId ASC
 *   - createdBy ASC
 */
