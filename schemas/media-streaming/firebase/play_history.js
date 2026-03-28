// play_history: user listening history and play context.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PLAY_CONTEXT_TYPE = /** @type {const} */ ({
  ALBUM: "album",
  PLAYLIST: "playlist",
  ARTIST: "artist",
  CHART: "chart",
  SEARCH: "search",
  QUEUE: "queue",
  UNKNOWN: "unknown",
});

/**
 * @typedef {Object} PlayHistoryDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} trackId - FK → tracks
 * @property {number} durationMs
 * @property {boolean} completed
 * @property {typeof PLAY_CONTEXT_TYPE[keyof typeof PLAY_CONTEXT_TYPE]} contextType
 * @property {string | null} contextId
 * @property {import("firebase/firestore").Timestamp} playedAt
 */

/**
 * @param {Omit<PlayHistoryDocument, "id" | "playedAt">} fields
 * @returns {Omit<PlayHistoryDocument, "id">}
 */
export function createPlayHistory(fields) {
  return {
    userId: fields.userId,
    trackId: fields.trackId,
    durationMs: fields.durationMs,
    completed: fields.completed ?? false,
    contextType: fields.contextType ?? PLAY_CONTEXT_TYPE.UNKNOWN,
    contextId: fields.contextId ?? null,
    playedAt: Timestamp.now(),
  };
}

export const playHistoryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      trackId: data.trackId,
      durationMs: data.durationMs,
      completed: data.completed,
      contextType: data.contextType,
      contextId: data.contextId ?? null,
      playedAt: data.playedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, playedAt DESC
 *   - trackId ASC, playedAt DESC
 *   - userId ASC, trackId ASC, playedAt DESC
 *   - userId ASC, contextType ASC, playedAt DESC
 */
