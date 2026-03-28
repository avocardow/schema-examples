// labels: record labels and music publishers.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LabelDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} website
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LabelDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LabelDocument, "id">}
 */
export function createLabel(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    website: fields.website ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const labelConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      website: data.website ?? null,
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
