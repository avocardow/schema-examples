// projects: top-level project containers with metadata and visibility settings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PROJECT_VISIBILITIES = /** @type {const} */ ({
  PUBLIC: "public",
  PRIVATE: "private",
});

/**
 * @typedef {Object} ProjectDocument
 * @property {string} id
 * @property {string} name
 * @property {string} key
 * @property {string | null} description
 * @property {string | null} icon
 * @property {string | null} color
 * @property {typeof PROJECT_VISIBILITIES[keyof typeof PROJECT_VISIBILITIES]} visibility
 * @property {number} taskCount
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ProjectDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ProjectDocument, "id">}
 */
export function createProject(fields) {
  return {
    name: fields.name,
    key: fields.key,
    description: fields.description ?? null,
    icon: fields.icon ?? null,
    color: fields.color ?? null,
    visibility: fields.visibility ?? PROJECT_VISIBILITIES.PUBLIC,
    taskCount: fields.taskCount ?? 0,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const projectConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      key: data.key,
      description: data.description ?? null,
      icon: data.icon ?? null,
      color: data.color ?? null,
      visibility: data.visibility,
      taskCount: data.taskCount,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "projects"
 *   - createdBy ASC, createdAt DESC
 */
