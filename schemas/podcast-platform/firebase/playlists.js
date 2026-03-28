// playlists: User-created episode playlists with optional smart filters.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PLAYLIST_TYPE = /** @type {const} */ ({
  MANUAL: "manual",
  SMART: "smart",
});

/**
 * @typedef {Object} PlaylistDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} name
 * @property {string | null} description
 * @property {typeof PLAYLIST_TYPE[keyof typeof PLAYLIST_TYPE]} playlistType
 * @property {Object | null} smartFilters
 * @property {boolean} isPublic
 * @property {number} episodeCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PlaylistDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PlaylistDocument, "id">}
 */
export function createPlaylist(fields) {
  return {
    userId: fields.userId,
    name: fields.name,
    description: fields.description ?? null,
    playlistType: fields.playlistType ?? PLAYLIST_TYPE.MANUAL,
    smartFilters: fields.smartFilters ?? null,
    isPublic: fields.isPublic ?? false,
    episodeCount: fields.episodeCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const playlistConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      name: data.name,
      description: data.description ?? null,
      playlistType: data.playlistType,
      smartFilters: data.smartFilters ?? null,
      isPublic: data.isPublic,
      episodeCount: data.episodeCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
