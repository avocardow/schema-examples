// lyrics: song lyrics in plain text and time-synced formats.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LyricsDocument
 * @property {string} id
 * @property {string} trackId - FK → tracks
 * @property {string | null} plainText
 * @property {Object | null} syncedText
 * @property {string | null} language
 * @property {string | null} source
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LyricsDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LyricsDocument, "id">}
 */
export function createLyrics(fields) {
  return {
    trackId: fields.trackId,
    plainText: fields.plainText ?? null,
    syncedText: fields.syncedText ?? null,
    language: fields.language ?? null,
    source: fields.source ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const lyricsConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      trackId: data.trackId,
      plainText: data.plainText ?? null,
      syncedText: data.syncedText ?? null,
      language: data.language ?? null,
      source: data.source ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - trackId ASC
 *
 * Composite indexes:
 *   - trackId ASC, language ASC
 */
