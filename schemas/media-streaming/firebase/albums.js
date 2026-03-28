// albums: music albums, singles, EPs, and compilations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ALBUM_TYPE = /** @type {const} */ ({
  ALBUM: "album",
  SINGLE: "single",
  EP: "ep",
  COMPILATION: "compilation",
});

/**
 * @typedef {Object} AlbumDocument
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} artistId - FK → artists
 * @property {string | null} labelId - FK → labels
 * @property {typeof ALBUM_TYPE[keyof typeof ALBUM_TYPE]} albumType
 * @property {string | null} coverFileId - FK → files
 * @property {string | null} releaseDate
 * @property {number} totalTracks
 * @property {number} totalDurationMs
 * @property {string | null} upc
 * @property {string | null} copyright
 * @property {number} popularity
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AlbumDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AlbumDocument, "id">}
 */
export function createAlbum(fields) {
  return {
    title: fields.title,
    slug: fields.slug,
    artistId: fields.artistId,
    labelId: fields.labelId ?? null,
    albumType: fields.albumType ?? ALBUM_TYPE.ALBUM,
    coverFileId: fields.coverFileId ?? null,
    releaseDate: fields.releaseDate ?? null,
    totalTracks: fields.totalTracks ?? 0,
    totalDurationMs: fields.totalDurationMs ?? 0,
    upc: fields.upc ?? null,
    copyright: fields.copyright ?? null,
    popularity: fields.popularity ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const albumConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      slug: data.slug,
      artistId: data.artistId,
      labelId: data.labelId ?? null,
      albumType: data.albumType,
      coverFileId: data.coverFileId ?? null,
      releaseDate: data.releaseDate ?? null,
      totalTracks: data.totalTracks,
      totalDurationMs: data.totalDurationMs,
      upc: data.upc ?? null,
      copyright: data.copyright ?? null,
      popularity: data.popularity,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug        ASC
 *   - releaseDate DESC
 *
 * Composite indexes:
 *   - artistId ASC, releaseDate DESC
 *   - albumType ASC, popularity DESC
 *   - labelId ASC, releaseDate DESC
 */
