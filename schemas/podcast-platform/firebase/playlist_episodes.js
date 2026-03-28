// playlist_episodes: Ordered episodes within a playlist.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PlaylistEpisodeDocument
 * @property {string} id
 * @property {string} playlistId - FK → playlists
 * @property {string} episodeId - FK → episodes
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} addedAt
 */

/**
 * @param {Omit<PlaylistEpisodeDocument, "id" | "addedAt">} fields
 * @returns {Omit<PlaylistEpisodeDocument, "id">}
 */
export function createPlaylistEpisode(fields) {
  return {
    playlistId: fields.playlistId,
    episodeId: fields.episodeId,
    position: fields.position,
    addedAt: Timestamp.now(),
  };
}

export const playlistEpisodeConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      playlistId: data.playlistId,
      episodeId: data.episodeId,
      position: data.position,
      addedAt: data.addedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - episodeId ASC
 *
 * Composite indexes:
 *   - playlistId ASC, position ASC
 */
