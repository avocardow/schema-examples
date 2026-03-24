// task_assignees: user assignments and reviewer designations for tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TASK_ASSIGNEE_ROLES = /** @type {const} */ ({
  ASSIGNEE: "assignee",
  REVIEWER: "reviewer",
});

/**
 * @typedef {Object} TaskAssigneeDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string} userId - FK → users
 * @property {typeof TASK_ASSIGNEE_ROLES[keyof typeof TASK_ASSIGNEE_ROLES]} role
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TaskAssigneeDocument, "id" | "createdAt">} fields
 * @returns {Omit<TaskAssigneeDocument, "id">}
 */
export function createTaskAssignee(fields) {
  return {
    taskId: fields.taskId,
    userId: fields.userId,
    role: fields.role ?? TASK_ASSIGNEE_ROLES.ASSIGNEE,
    createdAt: Timestamp.now(),
  };
}

export const taskAssigneeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      userId: data.userId,
      role: data.role,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_assignees"
 *   - taskId ASC, userId ASC (unique)
 *   - userId ASC
 */
