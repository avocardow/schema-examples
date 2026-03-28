// networks: Podcast networks that group multiple shows under a brand.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} NetworkDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {string | null} website
 * @property {string | null} logoFileId - FK → files
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<NetworkDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NetworkDocument, "id">}
 */
export function createNetwork(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    website: fields.website ?? null,
    logoFileId: fields.logoFileId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const networkConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      website: data.website ?? null,
      logoFileId: data.logoFileId ?? null,
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
