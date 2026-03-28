// playlists: user-created and curated playlists.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PlaylistDocument
 * @property {string} id
 * @property {string} ownerId - FK → users
 * @property {string} name
 * @property {string | null} description
 * @property {string | null} coverFileId - FK → files
 * @property {boolean} isPublic
 * @property {boolean} isCollaborative
 * @property {number} trackCount
 * @property {number} followerCount
 * @property {number} totalDurationMs
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PlaylistDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PlaylistDocument, "id">}
 */
export function createPlaylist(fields) {
  return {
    ownerId: fields.ownerId,
    name: fields.name,
    description: fields.description ?? null,
    coverFileId: fields.coverFileId ?? null,
    isPublic: fields.isPublic ?? true,
    isCollaborative: fields.isCollaborative ?? false,
    trackCount: fields.trackCount ?? 0,
    followerCount: fields.followerCount ?? 0,
    totalDurationMs: fields.totalDurationMs ?? 0,
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
      ownerId: data.ownerId,
      name: data.name,
      description: data.description ?? null,
      coverFileId: data.coverFileId ?? null,
      isPublic: data.isPublic,
      isCollaborative: data.isCollaborative,
      trackCount: data.trackCount,
      followerCount: data.followerCount,
      totalDurationMs: data.totalDurationMs,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - ownerId ASC, updatedAt DESC
 *   - isPublic ASC, followerCount DESC
 *   - isPublic ASC, updatedAt DESC
 */
