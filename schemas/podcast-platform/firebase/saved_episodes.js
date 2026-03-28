// saved_episodes: Episodes bookmarked by users for later listening.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SavedEpisodeDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} episodeId - FK → episodes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<SavedEpisodeDocument, "id" | "createdAt">} fields
 * @returns {Omit<SavedEpisodeDocument, "id">}
 */
export function createSavedEpisode(fields) {
  return {
    userId: fields.userId,
    episodeId: fields.episodeId,
    createdAt: Timestamp.now(),
  };
}

export const savedEpisodeConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      episodeId: data.episodeId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, createdAt DESC
 *   - userId ASC, episodeId ASC
 */
