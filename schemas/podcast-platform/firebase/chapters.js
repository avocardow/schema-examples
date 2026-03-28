// chapters: Timestamped chapter markers within an episode.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ChapterDocument
 * @property {string} id
 * @property {string} episodeId - FK → episodes
 * @property {number} startTimeMs
 * @property {number | null} endTimeMs
 * @property {string} title
 * @property {string | null} url
 * @property {string | null} imageUrl
 * @property {boolean} isHidden
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ChapterDocument, "id" | "createdAt">} fields
 * @returns {Omit<ChapterDocument, "id">}
 */
export function createChapter(fields) {
  return {
    episodeId: fields.episodeId,
    startTimeMs: fields.startTimeMs,
    endTimeMs: fields.endTimeMs ?? null,
    title: fields.title,
    url: fields.url ?? null,
    imageUrl: fields.imageUrl ?? null,
    isHidden: fields.isHidden ?? false,
    position: fields.position,
    createdAt: Timestamp.now(),
  };
}

export const chapterConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      episodeId: data.episodeId,
      startTimeMs: data.startTimeMs,
      endTimeMs: data.endTimeMs ?? null,
      title: data.title,
      url: data.url ?? null,
      imageUrl: data.imageUrl ?? null,
      isHidden: data.isHidden,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - episodeId ASC, startTimeMs ASC
 */
