// episode_queue: Ordered queue of episodes a user intends to listen to.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} EpisodeQueueDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} episodeId - FK → episodes
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} addedAt
 */

/**
 * @param {Omit<EpisodeQueueDocument, "id" | "addedAt">} fields
 * @returns {Omit<EpisodeQueueDocument, "id">}
 */
export function createEpisodeQueue(fields) {
  return {
    userId: fields.userId,
    episodeId: fields.episodeId,
    position: fields.position,
    addedAt: Timestamp.now(),
  };
}

export const episodeQueueConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      episodeId: data.episodeId,
      position: data.position,
      addedAt: data.addedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, position ASC
 *   - userId ASC, episodeId ASC
 */
