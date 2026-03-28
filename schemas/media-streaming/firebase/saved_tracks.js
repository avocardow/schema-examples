// saved_tracks: tracks saved to a user's library.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SavedTrackDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} trackId - FK → tracks
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<SavedTrackDocument, "id" | "createdAt">} fields
 * @returns {Omit<SavedTrackDocument, "id">}
 */
export function createSavedTrack(fields) {
  return {
    userId: fields.userId,
    trackId: fields.trackId,
    createdAt: Timestamp.now(),
  };
}

export const savedTrackConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      trackId: data.trackId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - trackId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
