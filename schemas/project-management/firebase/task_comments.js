// task_comments: threaded discussion comments on tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TaskCommentDocument
 * @property {string} id
 * @property {string} taskId - FK → tasks
 * @property {string | null} userId - FK → users
 * @property {string | null} parentId - FK → task_comments
 * @property {string} content
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TaskCommentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TaskCommentDocument, "id">}
 */
export function createTaskComment(fields) {
  return {
    taskId: fields.taskId,
    userId: fields.userId ?? null,
    parentId: fields.parentId ?? null,
    content: fields.content,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const taskCommentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      taskId: data.taskId,
      userId: data.userId ?? null,
      parentId: data.parentId ?? null,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_comments"
 *   - taskId ASC
 *   - parentId ASC
 *   - userId ASC
 */
