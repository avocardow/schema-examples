// task_activities: audit log of changes and actions performed on tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TASK_ACTIVITY_ACTIONS = /** @type {const} */ ({
  CREATED: "created",
  UPDATED: "updated",
  COMMENTED: "commented",
  ASSIGNED: "assigned",
  UNASSIGNED: "unassigned",
  LABELED: "labeled",
  UNLABELED: "unlabeled",
  MOVED: "moved",
  ARCHIVED: "archived",
  RESTORED: "restored",
});

/**
 * @typedef {Object} TaskActivityDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string | null} userId - FK → users
 * @property {typeof TASK_ACTIVITY_ACTIONS[keyof typeof TASK_ACTIVITY_ACTIONS]} action
 * @property {string | null} field
 * @property {string | null} oldValue
 * @property {string | null} newValue
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TaskActivityDocument, "id" | "createdAt">} fields
 * @returns {Omit<TaskActivityDocument, "id">}
 */
export function createTaskActivity(fields) {
  return {
    taskId: fields.taskId,
    userId: fields.userId ?? null,
    action: fields.action,
    field: fields.field ?? null,
    oldValue: fields.oldValue ?? null,
    newValue: fields.newValue ?? null,
    createdAt: Timestamp.now(),
  };
}

export const taskActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      userId: data.userId ?? null,
      action: data.action,
      field: data.field ?? null,
      oldValue: data.oldValue ?? null,
      newValue: data.newValue ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_activities"
 *   - taskId ASC, createdAt DESC
 *   - userId ASC
 */
