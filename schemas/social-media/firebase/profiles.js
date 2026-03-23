// profiles: user profile information, bios, and social metrics.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProfileDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string | null} displayName
 * @property {string | null} bio
 * @property {string | null} avatarFileId - FK → files
 * @property {string | null} bannerFileId - FK → files
 * @property {string | null} website
 * @property {string | null} location
 * @property {boolean} isPrivate
 * @property {number} followerCount
 * @property {number} followingCount
 * @property {number} postCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ProfileDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ProfileDocument, "id">}
 */
export function createProfile(fields) {
  return {
    userId: fields.userId,
    displayName: fields.displayName ?? null,
    bio: fields.bio ?? null,
    avatarFileId: fields.avatarFileId ?? null,
    bannerFileId: fields.bannerFileId ?? null,
    website: fields.website ?? null,
    location: fields.location ?? null,
    isPrivate: fields.isPrivate ?? false,
    followerCount: fields.followerCount ?? 0,
    followingCount: fields.followingCount ?? 0,
    postCount: fields.postCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const profileConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      displayName: data.displayName ?? null,
      bio: data.bio ?? null,
      avatarFileId: data.avatarFileId ?? null,
      bannerFileId: data.bannerFileId ?? null,
      website: data.website ?? null,
      location: data.location ?? null,
      isPrivate: data.isPrivate,
      followerCount: data.followerCount,
      followingCount: data.followingCount,
      postCount: data.postCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - userId      ASC
 *   - displayName ASC
 *   - isPrivate   ASC
 *
 * Composite indexes:
 *   - isPrivate ASC, followerCount DESC
 *   - isPrivate ASC, postCount DESC
 */
