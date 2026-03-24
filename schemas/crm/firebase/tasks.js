// tasks: actionable to-do items assigned to owners and linked to CRM entities.
// See README.md for full design rationale.

// Uses DEAL_PRIORITIES from deals.js (redefined here as TASK_PRIORITIES for self-containment).

import { Timestamp } from "firebase/firestore";

export const TASK_PRIORITIES = /** @type {const} */ ({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const TASK_STATUSES = /** @type {const} */ ({
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} TaskDocument
 * @property {string} id
 * @property {string} title
 * @property {string | null} description
 * @property {string | null} dueDate
 * @property {typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES]} priority
 * @property {typeof TASK_STATUSES[keyof typeof TASK_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} completedAt
 * @property {string | null} contactId - FK → contacts
 * @property {string | null} companyId - FK → companies
 * @property {string | null} dealId - FK → deals
 * @property {string} ownerId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TaskDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TaskDocument, "id">}
 */
export function createTask(fields) {
  return {
    title: fields.title,
    description: fields.description ?? null,
    dueDate: fields.dueDate ?? null,
    priority: fields.priority ?? TASK_PRIORITIES.MEDIUM,
    status: fields.status ?? TASK_STATUSES.TODO,
    completedAt: fields.completedAt ?? null,
    contactId: fields.contactId ?? null,
    companyId: fields.companyId ?? null,
    dealId: fields.dealId ?? null,
    ownerId: fields.ownerId,
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
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
      priority: data.priority,
      status: data.status,
      completedAt: data.completedAt ?? null,
      contactId: data.contactId ?? null,
      companyId: data.companyId ?? null,
      dealId: data.dealId ?? null,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tasks"
 *   - ownerId ASC, status ASC, dueDate ASC
 *   - contactId ASC, createdAt DESC
 *   - companyId ASC, createdAt DESC
 *   - dealId ASC, createdAt DESC
 *   - status ASC, dueDate ASC
 */
