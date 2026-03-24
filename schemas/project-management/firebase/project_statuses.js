// project_statuses: workflow status definitions for tasks within a project.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PROJECT_STATUS_CATEGORIES = /** @type {const} */ ({
  BACKLOG: "backlog",
  UNSTARTED: "unstarted",
  STARTED: "started",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} ProjectStatusDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} name
 * @property {string | null} color
 * @property {typeof PROJECT_STATUS_CATEGORIES[keyof typeof PROJECT_STATUS_CATEGORIES]} category
 * @property {number} position
 * @property {boolean} isDefault
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ProjectStatusDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ProjectStatusDocument, "id">}
 */
export function createProjectStatus(fields) {
  return {
    projectId: fields.projectId,
    name: fields.name,
    color: fields.color ?? null,
    category: fields.category,
    position: fields.position ?? 0,
    isDefault: fields.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const projectStatusConverter = {
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
      category: data.category,
      position: data.position,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "project_statuses"
 *   - projectId ASC, position ASC
 *   - projectId ASC, category ASC
 */
