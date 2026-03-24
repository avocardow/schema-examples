// task_labels: join records linking tasks to their assigned labels.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TaskLabelDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string} labelId - FK → labels
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TaskLabelDocument, "id" | "createdAt">} fields
 * @returns {Omit<TaskLabelDocument, "id">}
 */
export function createTaskLabel(fields) {
  return {
    taskId: fields.taskId,
    labelId: fields.labelId,
    createdAt: Timestamp.now(),
  };
}

export const taskLabelConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      labelId: data.labelId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_labels"
 *   - taskId ASC, labelId ASC (unique)
 *   - labelId ASC
 */
