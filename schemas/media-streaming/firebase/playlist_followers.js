// playlist_followers: users following playlists for updates.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PlaylistFollowerDocument
 * @property {string} id
 * @property {string} playlistId - FK → playlists
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PlaylistFollowerDocument, "id" | "createdAt">} fields
 * @returns {Omit<PlaylistFollowerDocument, "id">}
 */
export function createPlaylistFollower(fields) {
  return {
    playlistId: fields.playlistId,
    userId: fields.userId,
    createdAt: Timestamp.now(),
  };
}

export const playlistFollowerConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      playlistId: data.playlistId,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - playlistId ASC, createdAt DESC
 *   - userId ASC, createdAt DESC
 */
