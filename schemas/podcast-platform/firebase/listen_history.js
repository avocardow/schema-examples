// listen_history: Detailed log of listening sessions per user and episode.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const LISTEN_SOURCE = /** @type {const} */ ({
  APP: "app",
  WEB: "web",
  CAR: "car",
  SMART_SPEAKER: "smart_speaker",
  WATCH: "watch",
  UNKNOWN: "unknown",
});

/**
 * @typedef {Object} ListenHistoryDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} episodeId - FK → episodes
 * @property {import("firebase/firestore").Timestamp} startedAt
 * @property {import("firebase/firestore").Timestamp | null} endedAt
 * @property {number} positionStartMs
 * @property {number | null} positionEndMs
 * @property {number} durationListenedMs
 * @property {typeof LISTEN_SOURCE[keyof typeof LISTEN_SOURCE]} source
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ListenHistoryDocument, "id" | "createdAt">} fields
 * @returns {Omit<ListenHistoryDocument, "id">}
 */
export function createListenHistory(fields) {
  return {
    userId: fields.userId,
    episodeId: fields.episodeId,
    startedAt: fields.startedAt,
    endedAt: fields.endedAt ?? null,
    positionStartMs: fields.positionStartMs,
    positionEndMs: fields.positionEndMs ?? null,
    durationListenedMs: fields.durationListenedMs ?? 0,
    source: fields.source ?? LISTEN_SOURCE.UNKNOWN,
    createdAt: Timestamp.now(),
  };
}

export const listenHistoryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      episodeId: data.episodeId,
      startedAt: data.startedAt,
      endedAt: data.endedAt ?? null,
      positionStartMs: data.positionStartMs,
      positionEndMs: data.positionEndMs ?? null,
      durationListenedMs: data.durationListenedMs,
      source: data.source,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - userId ASC, startedAt DESC
 *   - episodeId ASC, startedAt DESC
 */
