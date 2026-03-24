// labels: categorization tags for organizing tasks within a project.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LabelDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} name
 * @property {string | null} color
 * @property {string | null} description
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<LabelDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<LabelDocument, "id">}
 */
export function createLabel(fields) {
  return {
    projectId: fields.projectId,
    name: fields.name,
    color: fields.color ?? null,
    description: fields.description ?? null,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const labelConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      name: data.name,
      color: data.color ?? null,
      description: data.description ?? null,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "labels"
 *   - projectId ASC, name ASC (unique)
 */
