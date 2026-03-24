// task_views: saved view configurations for displaying and filtering tasks.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TASK_VIEW_LAYOUTS = /** @type {const} */ ({
  LIST: "list",
  BOARD: "board",
  CALENDAR: "calendar",
  TIMELINE: "timeline",
});

/**
 * @typedef {Object} TaskViewDocument
 * @property {string} id
 * @property {string} projectId - FK → projects
 * @property {string} createdBy - FK → users
 * @property {string} name
 * @property {string | null} description
 * @property {typeof TASK_VIEW_LAYOUTS[keyof typeof TASK_VIEW_LAYOUTS]} layout
 * @property {Object | null} filters
 * @property {Object | null} sortBy
 * @property {string | null} groupBy
 * @property {boolean} isShared
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TaskViewDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TaskViewDocument, "id">}
 */
export function createTaskView(fields) {
  return {
    projectId: fields.projectId,
    createdBy: fields.createdBy,
    name: fields.name,
    description: fields.description ?? null,
    layout: fields.layout ?? TASK_VIEW_LAYOUTS.LIST,
    filters: fields.filters ?? null,
    sortBy: fields.sortBy ?? null,
    groupBy: fields.groupBy ?? null,
    isShared: fields.isShared ?? false,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const taskViewConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projectId: data.projectId,
      createdBy: data.createdBy,
      name: data.name,
      description: data.description ?? null,
      layout: data.layout,
      filters: data.filters ?? null,
      sortBy: data.sortBy ?? null,
      groupBy: data.groupBy ?? null,
      isShared: data.isShared,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "task_views"
 *   - projectId ASC, position ASC
 *   - createdBy ASC
 */
