// shows: Podcast shows / series with metadata and feed configuration.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const SHOW_TYPE = /** @type {const} */ ({
  EPISODIC: "episodic",
  SERIAL: "serial",
});

export const SHOW_MEDIUM = /** @type {const} */ ({
  PODCAST: "podcast",
  MUSIC: "music",
  VIDEO: "video",
  AUDIOBOOK: "audiobook",
  NEWSLETTER: "newsletter",
});

/**
 * @typedef {Object} ShowDocument
 * @property {string} id
 * @property {string} ownerId - FK → users
 * @property {string | null} networkId - FK → networks
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string | null} htmlDescription
 * @property {string} author
 * @property {string} language
 * @property {typeof SHOW_TYPE[keyof typeof SHOW_TYPE]} showType
 * @property {boolean} explicit
 * @property {string | null} artworkFileId - FK → files
 * @property {string | null} bannerFileId - FK → files
 * @property {string | null} feedUrl
 * @property {string | null} website
 * @property {string | null} copyright
 * @property {string | null} ownerName
 * @property {string | null} ownerEmail
 * @property {string | null} podcastGuid
 * @property {typeof SHOW_MEDIUM[keyof typeof SHOW_MEDIUM]} medium
 * @property {boolean} isComplete
 * @property {number} episodeCount
 * @property {number} subscriberCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ShowDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ShowDocument, "id">}
 */
export function createShow(fields) {
  return {
    ownerId: fields.ownerId,
    networkId: fields.networkId ?? null,
    title: fields.title,
    slug: fields.slug,
    description: fields.description,
    htmlDescription: fields.htmlDescription ?? null,
    author: fields.author,
    language: fields.language ?? "en",
    showType: fields.showType ?? SHOW_TYPE.EPISODIC,
    explicit: fields.explicit ?? false,
    artworkFileId: fields.artworkFileId ?? null,
    bannerFileId: fields.bannerFileId ?? null,
    feedUrl: fields.feedUrl ?? null,
    website: fields.website ?? null,
    copyright: fields.copyright ?? null,
    ownerName: fields.ownerName ?? null,
    ownerEmail: fields.ownerEmail ?? null,
    podcastGuid: fields.podcastGuid ?? null,
    medium: fields.medium ?? SHOW_MEDIUM.PODCAST,
    isComplete: fields.isComplete ?? false,
    episodeCount: fields.episodeCount ?? 0,
    subscriberCount: fields.subscriberCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const showConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ownerId: data.ownerId,
      networkId: data.networkId ?? null,
      title: data.title,
      slug: data.slug,
      description: data.description,
      htmlDescription: data.htmlDescription ?? null,
      author: data.author,
      language: data.language,
      showType: data.showType,
      explicit: data.explicit,
      artworkFileId: data.artworkFileId ?? null,
      bannerFileId: data.bannerFileId ?? null,
      feedUrl: data.feedUrl ?? null,
      website: data.website ?? null,
      copyright: data.copyright ?? null,
      ownerName: data.ownerName ?? null,
      ownerEmail: data.ownerEmail ?? null,
      podcastGuid: data.podcastGuid ?? null,
      medium: data.medium,
      isComplete: data.isComplete,
      episodeCount: data.episodeCount,
      subscriberCount: data.subscriberCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - ownerId ASC, subscriberCount DESC
 *   - language ASC, showType ASC
 *   - networkId ASC
 */
