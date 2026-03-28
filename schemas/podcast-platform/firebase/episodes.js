// episodes: Individual podcast episodes with media references and metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const EPISODE_TYPE = /** @type {const} */ ({
  FULL: "full",
  TRAILER: "trailer",
  BONUS: "bonus",
});

/**
 * @typedef {Object} EpisodeDocument
 * @property {string} id
 * @property {string} showId - FK → shows
 * @property {string} title
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} htmlDescription
 * @property {typeof EPISODE_TYPE[keyof typeof EPISODE_TYPE]} episodeType
 * @property {number | null} seasonNumber
 * @property {number | null} episodeNumber
 * @property {number} durationMs
 * @property {boolean} explicit
 * @property {string | null} audioFileId - FK → files
 * @property {string | null} artworkFileId - FK → files
 * @property {string | null} enclosureUrl
 * @property {number | null} enclosureLength
 * @property {string | null} enclosureType
 * @property {string | null} guid
 * @property {import("firebase/firestore").Timestamp | null} publishedAt
 * @property {boolean} isBlocked
 * @property {number} playCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<EpisodeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<EpisodeDocument, "id">}
 */
export function createEpisode(fields) {
  return {
    showId: fields.showId,
    title: fields.title,
    slug: fields.slug,
    description: fields.description ?? null,
    htmlDescription: fields.htmlDescription ?? null,
    episodeType: fields.episodeType ?? EPISODE_TYPE.FULL,
    seasonNumber: fields.seasonNumber ?? null,
    episodeNumber: fields.episodeNumber ?? null,
    durationMs: fields.durationMs ?? 0,
    explicit: fields.explicit ?? false,
    audioFileId: fields.audioFileId ?? null,
    artworkFileId: fields.artworkFileId ?? null,
    enclosureUrl: fields.enclosureUrl ?? null,
    enclosureLength: fields.enclosureLength ?? null,
    enclosureType: fields.enclosureType ?? null,
    guid: fields.guid ?? null,
    publishedAt: fields.publishedAt ?? null,
    isBlocked: fields.isBlocked ?? false,
    playCount: fields.playCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const episodeConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      showId: data.showId,
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      htmlDescription: data.htmlDescription ?? null,
      episodeType: data.episodeType,
      seasonNumber: data.seasonNumber ?? null,
      episodeNumber: data.episodeNumber ?? null,
      durationMs: data.durationMs,
      explicit: data.explicit,
      audioFileId: data.audioFileId ?? null,
      artworkFileId: data.artworkFileId ?? null,
      enclosureUrl: data.enclosureUrl ?? null,
      enclosureLength: data.enclosureLength ?? null,
      enclosureType: data.enclosureType ?? null,
      guid: data.guid ?? null,
      publishedAt: data.publishedAt ?? null,
      isBlocked: data.isBlocked,
      playCount: data.playCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - guid        ASC
 *   - publishedAt DESC
 *
 * Composite indexes:
 *   - showId ASC, publishedAt DESC
 *   - showId ASC, seasonNumber ASC, episodeNumber ASC
 */
