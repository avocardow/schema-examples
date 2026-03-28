// people: Individuals who contribute to shows and episodes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PersonDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} bio
 * @property {string | null} url
 * @property {string | null} imageFileId - FK → files
 * @property {string | null} podcastIndexId
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PersonDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PersonDocument, "id">}
 */
export function createPerson(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    bio: fields.bio ?? null,
    url: fields.url ?? null,
    imageFileId: fields.imageFileId ?? null,
    podcastIndexId: fields.podcastIndexId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const personConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      bio: data.bio ?? null,
      url: data.url ?? null,
      imageFileId: data.imageFileId ?? null,
      podcastIndexId: data.podcastIndexId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug ASC
 *   - name ASC
 */
