// task_dependencies: directed relationships between tasks for dependency tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TASK_DEPENDENCY_TYPES = /** @type {const} */ ({
  BLOCKS: "blocks",
  IS_BLOCKED_BY: "is_blocked_by",
  RELATES_TO: "relates_to",
  DUPLICATES: "duplicates",
});

/**
 * @typedef {Object} TaskDependencyDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string} dependsOnId - FK → tasks
 * @property {typeof TASK_DEPENDENCY_TYPES[keyof typeof TASK_DEPENDENCY_TYPES]} type
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TaskDependencyDocument, "id" | "createdAt">} fields
 * @returns {Omit<TaskDependencyDocument, "id">}
 */
export function createTaskDependency(fields) {
  return {
    taskId: fields.taskId,
    dependsOnId: fields.dependsOnId,
    type: fields.type,
    createdAt: Timestamp.now(),
  };
}

export const taskDependencyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      dependsOnId: data.dependsOnId,
      type: data.type,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_dependencies"
 *   - taskId ASC, dependsOnId ASC, type ASC (unique)
 *   - dependsOnId ASC
 */
