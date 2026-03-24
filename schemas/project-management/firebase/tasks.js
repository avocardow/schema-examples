// tasks: individual work items with type, priority, and tracking metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TASK_TYPES = /** @type {const} */ ({
  TASK: "task",
  BUG: "bug",
  STORY: "story",
  EPIC: "epic",
});

export const TASK_PRIORITIES = /** @type {const} */ ({
  NONE: "none",
  URGENT: "urgent",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
});

/**
 * @typedef {Object} TaskDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string | null} taskListId - FK → task_lists
 * @property {string | null} parentId - FK → tasks
 * @property {string | null} statusId - FK → project_statuses
 * @property {string | null} milestoneId - FK → milestones
 * @property {number} number
 * @property {string} title
 * @property {string | null} description
 * @property {typeof TASK_TYPES[keyof typeof TASK_TYPES]} type
 * @property {typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES]} priority
 * @property {string | null} dueDate
 * @property {string | null} startDate
 * @property {number | null} estimatePoints
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp | null} completedAt
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TaskDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TaskDocument, "id">}
 */
export function createTask(fields) {
  return {
    projectId: fields.projectId,
    taskListId: fields.taskListId ?? null,
    parentId: fields.parentId ?? null,
    statusId: fields.statusId ?? null,
    milestoneId: fields.milestoneId ?? null,
    number: fields.number,
    title: fields.title,
    description: fields.description ?? null,
    type: fields.type ?? TASK_TYPES.TASK,
    priority: fields.priority ?? TASK_PRIORITIES.NONE,
    dueDate: fields.dueDate ?? null,
    startDate: fields.startDate ?? null,
    estimatePoints: fields.estimatePoints ?? null,
    position: fields.position ?? 0,
    completedAt: fields.completedAt ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const taskConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      taskListId: data.taskListId ?? null,
      parentId: data.parentId ?? null,
      statusId: data.statusId ?? null,
      milestoneId: data.milestoneId ?? null,
      number: data.number,
      title: data.title,
      description: data.description ?? null,
      type: data.type,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      startDate: data.startDate ?? null,
      estimatePoints: data.estimatePoints ?? null,
      position: data.position,
      completedAt: data.completedAt ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tasks"
 *   - projectId ASC, number ASC (unique)
 *   - projectId ASC, statusId ASC
 *   - taskListId ASC, position ASC
 *   - parentId ASC
 *   - milestoneId ASC
 *   - type ASC
 *   - dueDate ASC
 *   - createdBy ASC
 */
