// artists: musical artists and their profile information.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ArtistDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} bio
 * @property {string | null} imageFileId - FK → files
 * @property {string | null} bannerFileId - FK → files
 * @property {boolean} isVerified
 * @property {number} followerCount
 * @property {number} monthlyListeners
 * @property {number} popularity
 * @property {string | null} externalUrl
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ArtistDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ArtistDocument, "id">}
 */
export function createArtist(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    bio: fields.bio ?? null,
    imageFileId: fields.imageFileId ?? null,
    bannerFileId: fields.bannerFileId ?? null,
    isVerified: fields.isVerified ?? false,
    followerCount: fields.followerCount ?? 0,
    monthlyListeners: fields.monthlyListeners ?? 0,
    popularity: fields.popularity ?? 0,
    externalUrl: fields.externalUrl ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const artistConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      bio: data.bio ?? null,
      imageFileId: data.imageFileId ?? null,
      bannerFileId: data.bannerFileId ?? null,
      isVerified: data.isVerified,
      followerCount: data.followerCount,
      monthlyListeners: data.monthlyListeners,
      popularity: data.popularity,
      externalUrl: data.externalUrl ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug             ASC
 *   - monthlyListeners DESC
 *   - createdAt        DESC
 *
 * Composite indexes:
 *   - isVerified ASC, popularity DESC
 */
