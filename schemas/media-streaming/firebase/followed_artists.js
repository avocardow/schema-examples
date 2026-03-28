// followed_artists: artists followed by users.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FollowedArtistDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} artistId - FK → artists
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<FollowedArtistDocument, "id" | "createdAt">} fields
 * @returns {Omit<FollowedArtistDocument, "id">}
 */
export function createFollowedArtist(fields) {
  return {
    userId: fields.userId,
    artistId: fields.artistId,
    createdAt: Timestamp.now(),
  };
}

export const followedArtistConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      artistId: data.artistId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - artistId ASC
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 */
