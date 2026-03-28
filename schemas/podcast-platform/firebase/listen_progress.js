// listen_progress: Per-user per-episode playback position tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ListenProgressDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} episodeId - FK → episodes
 * @property {number} positionMs
 * @property {number} durationMs
 * @property {boolean} completed
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ListenProgressDocument, "id" | "updatedAt">} fields
 * @returns {Omit<ListenProgressDocument, "id">}
 */
export function createListenProgress(fields) {
  return {
    userId: fields.userId,
    episodeId: fields.episodeId,
    positionMs: fields.positionMs ?? 0,
    durationMs: fields.durationMs ?? 0,
    completed: fields.completed ?? false,
    updatedAt: Timestamp.now(),
  };
}

export const listenProgressConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      episodeId: data.episodeId,
      positionMs: data.positionMs,
      durationMs: data.durationMs,
      completed: data.completed,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, episodeId ASC
 *   - userId ASC, completed ASC, updatedAt DESC
 */
