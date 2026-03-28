// playlist_tracks: tracks within playlists with ordering and attribution.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PlaylistTrackDocument
 * @property {string} id
 * @property {string} playlistId - FK → playlists
 * @property {string} trackId - FK → tracks
 * @property {string} addedBy - FK → users
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} addedAt
 */

/**
 * @param {Omit<PlaylistTrackDocument, "id" | "addedAt">} fields
 * @returns {Omit<PlaylistTrackDocument, "id">}
 */
export function createPlaylistTrack(fields) {
  return {
    playlistId: fields.playlistId,
    trackId: fields.trackId,
    addedBy: fields.addedBy,
    position: fields.position,
    addedAt: Timestamp.now(),
  };
}

export const playlistTrackConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      playlistId: data.playlistId,
      trackId: data.trackId,
      addedBy: data.addedBy,
      position: data.position,
      addedAt: data.addedAt,
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
 *   - playlistId ASC, position ASC
 *   - playlistId ASC, addedAt DESC
 */
