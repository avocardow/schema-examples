// task_lists: ordered groupings of tasks within a project.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TaskListDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} name
 * @property {string | null} description
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TaskListDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TaskListDocument, "id">}
 */
export function createTaskList(fields) {
  return {
    projectId: fields.projectId,
    name: fields.name,
    description: fields.description ?? null,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const taskListConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      name: data.name,
      description: data.description ?? null,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_lists"
 *   - projectId ASC, position ASC
 */
